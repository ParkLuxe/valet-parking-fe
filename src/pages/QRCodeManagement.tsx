/**
 * QR Code Management Page
 * Generate, manage, and export QR codes
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type {  RootState  } from '../redux';
import { QRCodeSVG } from 'qrcode.react';
import { Card } from '../components';
import { Button } from '../components';
import { LoadingSpinner } from '../components';
import { Modal } from '../components';
import { Input } from '../components';
import { qrCodeService } from '../services';
import {  addToast  } from '../redux';
import { usePermissions } from '../hooks';

const QRCodeManagement = () => {
  const dispatch = useDispatch();
  const { can } = usePermissions();
  const { user } = useSelector((state: RootState) => state.auth);

  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchCount, setBatchCount] = useState(10);
  const [selectedQR, setSelectedQR] = useState(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [slotId, setSlotId] = useState('');

  useEffect(() => {
    if (user?.hostId && can('canManageQR')) {
      fetchActiveQRCodes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchActiveQRCodes = async () => {
    setLoading(true);
    try {
      const response = await qrCodeService.getActiveQRCodes(user.hostId);
      setQrCodes(response || []);
    } catch (err) {
      dispatch(addToast({
        type: 'error',
        message: 'Failed to load QR codes',
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSingle = async () => {
    try {
      setLoading(true);
      await qrCodeService.generate({
        hostId: user.hostId,
      });
      dispatch(addToast({
        type: 'success',
        message: 'QR code generated successfully',
      }));
      fetchActiveQRCodes();
    } catch (err) {
      dispatch(addToast({
        type: 'error',
        message: 'Failed to generate QR code',
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBatch = async () => {
    try {
      setLoading(true);
      await qrCodeService.generateBatch(user.hostId, batchCount);
      dispatch(addToast({
        type: 'success',
        message: `${batchCount} QR codes generated successfully`,
      }));
      setShowBatchModal(false);
      setBatchCount(10);
      fetchActiveQRCodes();
    } catch (err) {
      dispatch(addToast({
        type: 'error',
        message: 'Failed to generate batch QR codes',
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (qrCode) => {
    if (!window.confirm('Are you sure you want to deactivate this QR code?')) {
      return;
    }

    try {
      await qrCodeService.deactivate(qrCode);
      dispatch(addToast({
        type: 'success',
        message: 'QR code deactivated successfully',
      }));
      fetchActiveQRCodes();
    } catch (err) {
      dispatch(addToast({
        type: 'error',
        message: 'Failed to deactivate QR code',
      }));
    }
  };

  const handleLinkToSlot = async () => {
    if (!slotId) {
      dispatch(addToast({
        type: 'error',
        message: 'Please enter a slot ID',
      }));
      return;
    }

    try {
      await qrCodeService.linkToSlot(selectedQR.qrCode, slotId);
      dispatch(addToast({
        type: 'success',
        message: 'QR code linked to slot successfully',
      }));
      setShowLinkModal(false);
      setSelectedQR(null);
      setSlotId('');
      fetchActiveQRCodes();
    } catch (err) {
      dispatch(addToast({
        type: 'error',
        message: 'Failed to link QR code to slot',
      }));
    }
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      const response = await qrCodeService.exportQRCodes(user.hostId);
      
      // Create download link
      const blob = new Blob([JSON.stringify(response, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `qr-codes-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      dispatch(addToast({
        type: 'success',
        message: 'QR codes exported successfully',
      }));
    } catch (err) {
      dispatch(addToast({
        type: 'error',
        message: 'Failed to export QR codes',
      }));
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = (qrCode) => {
    const svg = document.getElementById(`qr-${qrCode}`);
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = `qr-code-${qrCode}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  if (!can('canManageQR')) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          You don't have permission to manage QR codes.
        </div>
      </div>
    );
  }

  if (loading && qrCodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">QR Code Management</h1>
          <p className="text-gray-600 mt-1">Generate and manage QR codes for parking</p>
        </div>
        <div className="flex gap-2">
          {can('canGenerateQR') && (
            <>
              <Button onClick={handleGenerateSingle} disabled={loading}>
                Generate Single QR
              </Button>
              <Button onClick={() => setShowBatchModal(true)} variant="outline" disabled={loading}>
                Generate Batch
              </Button>
            </>
          )}
          {can('canExportQR') && (
            <Button onClick={handleExport} variant="outline" disabled={loading}>
              Export All
            </Button>
          )}
        </div>
      </div>

      {/* QR Code Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {qrCodes.map((qr) => (
          <Card key={qr.id || qr.qrCode} className="flex flex-col items-center p-4">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <QRCodeSVG
                id={`qr-${qr.qrCode}`}
                value={qr.qrCode}
                size={150}
                level="H"
                includeMargin
              />
            </div>
            <div className="mt-4 text-center w-full">
              <p className="font-mono text-sm font-semibold">{qr.qrCode}</p>
              {qr.linkedSlotId && (
                <p className="text-xs text-gray-600 mt-1">
                  Slot: {qr.linkedSlotId}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Status: {qr.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className="flex gap-2 mt-4 w-full">
              <Button
                variant="outline"
                className="flex-1 text-sm"
                onClick={() => downloadQRCode(qr.qrCode)}
              >
                Download
              </Button>
              {can('canLinkQRToSlot') && (
                <Button
                  variant="outline"
                  className="flex-1 text-sm"
                  onClick={() => {
                    setSelectedQR(qr);
                    setShowLinkModal(true);
                  }}
                >
                  Link Slot
                </Button>
              )}
              {can('canDeactivateQR') && qr.isActive && (
                <Button
                  variant="outline"
                  className="flex-1 text-sm"
                  onClick={() => handleDeactivate(qr.qrCode)}
                >
                  Deactivate
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {qrCodes.length === 0 && !loading && (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No QR codes found</p>
            <p className="text-gray-400 mt-2">Generate your first QR code to get started</p>
          </div>
        </Card>
      )}

      {/* Batch Generate Modal */}
      {showBatchModal && (
        <Modal
          open={showBatchModal}
          onClose={() => setShowBatchModal(false)}
          title="Generate Batch QR Codes"
        >
          <div className="space-y-4">
            <Input
              label="Number of QR Codes"
              type="number"
              min="1"
              max="100"
              value={batchCount}
              onChange={(e) => setBatchCount(parseInt(e.target.value) || 1)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowBatchModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleGenerateBatch} disabled={loading}>
                Generate {batchCount} QR Codes
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Link to Slot Modal */}
      {showLinkModal && selectedQR && (
        <Modal
          open={showLinkModal}
          onClose={() => {
            setShowLinkModal(false);
            setSelectedQR(null);
            setSlotId('');
          }}
          title="Link QR Code to Parking Slot"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              QR Code: <span className="font-mono font-semibold">{selectedQR.qrCode}</span>
            </p>
            <Input
              label="Parking Slot ID"
              type="text"
              value={slotId}
              onChange={(e) => setSlotId(e.target.value)}
              placeholder="e.g., A-101"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowLinkModal(false);
                  setSelectedQR(null);
                  setSlotId('');
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleLinkToSlot}>
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
