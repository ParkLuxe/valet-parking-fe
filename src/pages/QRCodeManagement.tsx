/**
 * QR Code Management — Valet Mobile Operations Design
 * QR Hub: Batch Configuration panel + Recent Batches + QR grid cards
 * Preserves all existing hooks and business logic
 */

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '../components';
import { LoadingSpinner } from '../components';
import { Modal } from '../components';
import { Input } from '../components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useActiveQRCodes,
  useGenerateQRCode,
  useGenerateBatchQRCodes,
  useDeactivateQRCode,
  useLinkQRCodeToSlot,
} from '../hooks/queries/useQRCodes';
import { addToast } from '../redux';
import { usePermissions } from '../hooks';
import { QrCode, Download, Link, X, Layers, Sparkles, ChevronRight } from 'lucide-react';

const QRCodeManagement = () => {
  const dispatch = useDispatch();
  const { can } = usePermissions();
  const { user } = useSelector((state: RootState) => state.auth);

  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchCount, setBatchCount] = useState(10);
  const [selectedQR, setSelectedQR] = useState<{ qrCode: string } | null>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [slotId, setSlotId] = useState('');

  // ─── Hooks (unchanged) ────────────────────────────────────────────────
  const { data: qrCodes = [], isLoading: loading, refetch } = useActiveQRCodes(user?.hostId || '');
  const generateQRMutation     = useGenerateQRCode();
  const generateBatchMutation  = useGenerateBatchQRCodes();
  const deactivateMutation     = useDeactivateQRCode();
  const linkToSlotMutation     = useLinkQRCodeToSlot();

  // ─── Handlers (unchanged logic) ──────────────────────────────────────
  const handleGenerateSingle = async () => {
    try {
      await generateQRMutation.mutateAsync({ hostId: user.hostId });
      refetch();
    } catch (_) {}
  };

  const handleGenerateBatch = async () => {
    try {
      await generateBatchMutation.mutateAsync({ hostId: user.hostId, count: batchCount });
      setShowBatchModal(false);
      setBatchCount(10);
      refetch();
    } catch (_) {}
  };

  const handleDeactivate = async (qrCode: string) => {
    if (!window.confirm('Deactivate this QR code?')) return;
    try {
      await deactivateMutation.mutateAsync(qrCode);
      refetch();
    } catch (_) {}
  };

  const handleLinkToSlot = async () => {
    if (!slotId) {
      dispatch(addToast({ type: 'error', message: 'Please enter a slot ID' }));
      return;
    }
    if (!selectedQR) {
      dispatch(addToast({ type: 'error', message: 'No QR code selected' }));
      return;
    }
    try {
      await linkToSlotMutation.mutateAsync({ qrCode: selectedQR.qrCode, slotId });
      setShowLinkModal(false);
      setSelectedQR(null);
      setSlotId('');
      refetch();
    } catch (_) {}
  };

  const downloadQRCode = (qrCode: string) => {
    const svg = document.getElementById(`qr-${qrCode}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const link = document.createElement('a');
      link.download = `qr-code-${qrCode}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  // ─── Permission guard ─────────────────────────────────────────────────
  if (!can('canManageQR')) {
    return (
      <div className="p-8">
        <div className="p-4 rounded-[12px]" style={{ background: 'rgba(233,195,73,0.08)', border: '1px solid rgba(233,195,73,0.2)' }}>
          <p className="text-sm" style={{ color: '#e9c349', fontFamily: 'Inter, sans-serif' }}>
            You don't have permission to manage QR codes.
          </p>
        </div>
      </div>
    );
  }

  if (loading && qrCodes.length === 0) {
    return <LoadingSpinner message="Loading QR codes..." fullScreen />;
  }

  const activeCount   = qrCodes.filter(q => q.isActive).length;
  const inactiveCount = qrCodes.filter(q => !q.isActive).length;
  const linkedCount   = qrCodes.filter(q => q.linkedSlotId).length;

  return (
    <div className="p-6 space-y-6">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest mb-1" style={{ color: '#8b5cf6', fontFamily: 'Inter, sans-serif' }}>AUTHENTICATION HUB</p>
          <h1 className="text-4xl font-bold mb-1" style={{ color: '#dae2fd', fontFamily: 'Manrope, sans-serif' }}>QR Hub</h1>
          <p className="text-sm" style={{ color: '#909097', fontFamily: 'Inter, sans-serif' }}>
            Batch generation & lifecycle management for valet QR codes
          </p>
        </div>

        {can('canGenerateQR') && (
          <div className="flex gap-2">
            <Button
              onClick={handleGenerateSingle}
              disabled={loading}
              startIcon={<Sparkles className="w-4 h-4" />}
            >
              Generate Single
            </Button>
            <Button
              onClick={() => setShowBatchModal(true)}
              variant="outline"
              disabled={loading}
              startIcon={<Layers className="w-4 h-4" />}
            >
              Batch Generate
            </Button>
          </div>
        )}
      </motion.div>

      {/* ── Stats bar ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-8 px-6 py-4 rounded-[12px]"
        style={{ background: '#171f33', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
      >
        {[
          { label: 'Total QR Codes',  value: qrCodes.length, color: '#dae2fd' },
          { label: 'Active',          value: activeCount,     color: '#4ade80'  },
          { label: 'Inactive',        value: inactiveCount,   color: '#909097'  },
          { label: 'Linked to Slots', value: linkedCount,     color: '#8b5cf6'  },
        ].map((stat, i) => (
          <React.Fragment key={stat.label}>
            <div>
              <p className="text-2xl font-bold tabular-nums" style={{ color: stat.color, fontFamily: 'Manrope, sans-serif' }}>
                {stat.value}
              </p>
              <p className="text-xs" style={{ color: '#909097', fontFamily: 'Inter, sans-serif' }}>{stat.label}</p>
            </div>
            {i < 3 && <div className="w-px h-8" style={{ background: 'rgba(139,92,246,0.08)' }} />}
          </React.Fragment>
        ))}
      </motion.div>

      {/* ── QR Code Grid ─────────────────────────────────────────────── */}
      {qrCodes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <AnimatePresence>
            {qrCodes.map((qr, i) => (
              <motion.div
                key={qr.id || qr.qrCode}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ delay: i * 0.02 }}
                className="flex flex-col rounded-[12px] overflow-hidden"
                style={{
                  background: '#171f33',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                }}
              >
                {/* QR display */}
                <div className="flex items-center justify-center p-5 pb-4">
                  <div className="p-3 rounded-[0.375rem]" style={{ background: '#fff' }}>
                    <QRCodeSVG
                      id={`qr-${qr.qrCode}`}
                      value={qr.qrCode}
                      size={120}
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="px-4 pb-4 flex-1">
                  <p className="text-xs font-mono font-bold mb-1 truncate" style={{ color: '#8b5cf6' }}>
                    {qr.qrCode}
                  </p>
                  {qr.linkedSlotId && (
                    <p className="text-xs mb-0.5" style={{ color: '#c6c6cd', fontFamily: 'Inter, sans-serif' }}>
                      Slot: {qr.linkedSlotId}
                    </p>
                  )}
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: qr.isActive ? 'rgba(74,222,128,0.12)' : 'rgba(144,144,151,0.12)',
                      color: qr.isActive ? '#4ade80' : '#909097',
                    }}
                  >
                    {qr.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex border-t" style={{ borderColor: 'rgba(139,92,246,0.08)' }}>
                  <button
                    onClick={() => downloadQRCode(qr.qrCode)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors"
                    style={{ color: '#909097', fontFamily: 'Inter, sans-serif' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#8b5cf6')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#909097')}
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>

                  {can('canLinkQRToSlot') && (
                    <>
                      <div className="w-px" style={{ background: 'rgba(139,92,246,0.08)' }} />
                      <button
                        onClick={() => { setSelectedQR(qr); setShowLinkModal(true); }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors"
                        style={{ color: '#909097', fontFamily: 'Inter, sans-serif' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#e9c349')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#909097')}
                      >
                        <Link className="w-3.5 h-3.5" /> Link
                      </button>
                    </>
                  )}

                  {can('canDeactivateQR') && qr.isActive && (
                    <>
                      <div className="w-px" style={{ background: 'rgba(139,92,246,0.08)' }} />
                      <button
                        onClick={() => handleDeactivate(qr.qrCode)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors"
                        style={{ color: '#909097', fontFamily: 'Inter, sans-serif' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#909097')}
                      >
                        <X className="w-3.5 h-3.5" /> Deactivate
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24">
          <QrCode className="w-16 h-16 mb-4 opacity-15" style={{ color: '#8b5cf6' }} />
          <p className="text-lg font-semibold mb-2" style={{ color: '#c6c6cd', fontFamily: 'Manrope, sans-serif' }}>No QR codes yet</p>
          <p className="text-sm mb-6" style={{ color: '#909097', fontFamily: 'Inter, sans-serif' }}>Generate your first QR code to begin</p>
          {can('canGenerateQR') && (
            <Button onClick={handleGenerateSingle} startIcon={<Sparkles className="w-4 h-4" />}>
              Generate First QR
            </Button>
          )}
        </div>
      )}

      {/* ── Batch Generate Modal ─────────────────────────────────────── */}
      {showBatchModal && (
        <Modal open={showBatchModal} onClose={() => setShowBatchModal(false)} title="Batch QR Generator">
          <div className="space-y-5">
            <div className="p-4 rounded-[0.375rem]" style={{ background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.1)' }}>
              <p className="text-xs mb-3" style={{ color: '#8b5cf6', fontFamily: 'Inter, sans-serif' }}>BATCH CONFIGURATION</p>
              <Input
                label="Number of QR Codes"
                type="number"
                min="1"
                max="100"
                value={batchCount}
                onChange={(e) => setBatchCount(parseInt(e.target.value) || 1)}
              />
              <p className="text-xs mt-2" style={{ color: '#909097', fontFamily: 'Inter, sans-serif' }}>
                Generate up to 100 unique QR codes in a single batch
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowBatchModal(false)}>Cancel</Button>
              <Button
                onClick={handleGenerateBatch}
                disabled={loading}
                startIcon={<ChevronRight className="w-4 h-4" />}
              >
                Generate {batchCount} QR Codes
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Link to Slot Modal ───────────────────────────────────────── */}
      {showLinkModal && selectedQR && (
        <Modal
          open={showLinkModal}
          onClose={() => { setShowLinkModal(false); setSelectedQR(null); setSlotId(''); }}
          title="Link QR Code to Slot"
        >
          <div className="space-y-4">
            <div className="p-3 rounded-[0.375rem]" style={{ background: 'rgba(139,92,246,0.06)' }}>
              <p className="text-xs" style={{ color: '#909097', fontFamily: 'Inter, sans-serif' }}>Selected QR Code</p>
              <p className="font-mono text-sm font-bold" style={{ color: '#8b5cf6' }}>{selectedQR.qrCode}</p>
            </div>
            <Input
              label="Parking Slot ID"
              type="text"
              value={slotId}
              onChange={(e) => setSlotId(e.target.value)}
              placeholder="e.g., A-101"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setShowLinkModal(false); setSelectedQR(null); setSlotId(''); }}>
                Cancel
              </Button>
              <Button onClick={handleLinkToSlot} startIcon={<Link className="w-4 h-4" />}>
                Link to Slot
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default QRCodeManagement;
