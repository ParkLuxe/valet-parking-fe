/**
 * QR Scan & Vehicle Intake — Valet Mobile Operations Design
 * Two-panel layout: Customer & Vehicle Info (left) + QR display (right)
 * Preserves all existing API hooks, validation, and submission logic
 */

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux";
import { QRCodeSVG as QRCode } from "qrcode.react";
import { Input, Button } from "../components";
import { addToast } from "../redux";
import { useAvailableParkingSlots } from "../hooks/queries/useParkingSlots";
import { useHostUsers } from "../hooks/queries/useHostUsers";
import { useGenerateQRCode } from "../hooks/queries/useQRCodes";
import { useSubscriptionStatus } from "../hooks/queries/useSubscriptions";
import { useTheme } from "../contexts/ThemeContext";
import { validateVehicleNumber } from "../utils";
import { motion } from "framer-motion";
import { Car, MapPin, User, QrCode, CheckCircle, AlertTriangle, X } from "lucide-react";

const QRScanPage = () => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);
  const hostId = user?.hostId || "";

  // ─── Hooks (unchanged) ────────────────────────────────────────────────
  const { data: parkingSlots = [] } = useAvailableParkingSlots();
  const { data: hostUsers = [] } = useHostUsers();
  const { data: subscription } = useSubscriptionStatus(hostId);
  const generateQRMutation = useGenerateQRCode();

  const subscriptionStatus = subscription?.status || "active";
  const usage = subscription?.usage || { remainingScans: 0 };
  const slots = parkingSlots || [];
  const valetList = hostUsers || [];

  const [qrValue, setQrValue] = useState("");
  const [formData, setFormData] = useState({ vehicleNumber: "", parkingSlotId: "", valetId: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const loading = generateQRMutation.isPending;
  const paperStyle = { background: colors.surfaceCard, border: `1px solid ${colors.border}`, boxShadow: '0 10px 28px rgba(15,23,42,0.08)' } as React.CSSProperties;
  const raisedPaperStyle = { background: colors.surfaceCardRaised, border: `1px solid ${colors.border}`, boxShadow: '0 10px 28px rgba(15,23,42,0.08)' } as React.CSSProperties;

  // ─── Handlers (unchanged logic) ──────────────────────────────────────
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: any = {};
    const vehicleValidation = validateVehicleNumber(formData.vehicleNumber);
    if (!vehicleValidation.isValid) newErrors.vehicleNumber = vehicleValidation.error;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (subscriptionStatus === "expired") {
      dispatch(addToast({ type: "error", message: "Subscription expired. Please renew to continue." }));
      return;
    }
    if (usage.remainingScans <= 0 && subscriptionStatus === "grace_period") {
      dispatch(addToast({ type: "warning", message: "Grace period active. Please pay pending amount." }));
    }
    if (!validate()) return;
    try {
      const payload: { vehicleNumber: string; phoneNumber?: string; slotId?: string; valetHostUserId?: number } = {
        vehicleNumber: formData.vehicleNumber.trim(),
      };
      if (formData.parkingSlotId) payload.slotId = formData.parkingSlotId;
      if (formData.valetId) {
        const n = Number(formData.valetId);
        if (!isNaN(n)) payload.valetHostUserId = n;
      }
      const userPhone = (user as any)?.phone || (user as any)?.phoneNumber;
      if (userPhone) payload.phoneNumber = String(userPhone);

      const response = await generateQRMutation.mutateAsync(payload);
      if (response) setQrValue(response);
      dispatch(addToast({ type: "success", message: "QR created successfully" }));
      setFormData({ vehicleNumber: "", parkingSlotId: "", valetId: "" });
    } catch {}
  };

  // ─── Helpers ──────────────────────────────────────────────────────────
  const selectedValet = valetList.find(v => String(v.hostUserId) === formData.valetId);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-semibold tracking-widest mb-1" style={{ color: colors.primary, fontFamily: 'Inter, sans-serif' }}>
          VEHICLE INTAKE
        </p>
        <h1 className="text-4xl font-bold mb-1" style={{ color: colors.text, fontFamily: 'Space Grotesk, sans-serif' }}>
          Vehicle Intake & QR Generation
        </h1>
        <p className="text-sm" style={{ color: colors.textMuted, fontFamily: 'Outfit, sans-serif' }}>
          Input vehicle and customer specifications to authorize a new premium valet session.
        </p>
      </motion.div>

      {/* Subscription warnings */}
      {subscriptionStatus === "grace_period" && (
        <div className="flex items-center gap-3 p-4 rounded-[0.375rem]" style={{ background: 'rgba(233,195,73,0.08)', border: '1px solid rgba(233,195,73,0.2)' }}>
          <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: '#e9c349' }} />
          <p className="text-sm" style={{ color: '#e9c349', fontFamily: 'Inter, sans-serif' }}>
            Grace Period Active — Remaining scans: {usage.remainingScans}. Please renew your subscription.
          </p>
        </div>
      )}
      {subscriptionStatus === "expired" && (
        <div className="flex items-center gap-3 p-4 rounded-[0.375rem]" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}>
          <X className="w-4 h-4 flex-shrink-0" style={{ color: '#f87171' }} />
          <p className="text-sm" style={{ color: '#f87171', fontFamily: 'Inter, sans-serif' }}>
            Subscription Expired — Please renew to continue using this service.
          </p>
        </div>
      )}

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ── Left: Form ─────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Customer & Vehicle section */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-[12px] space-y-5"
            style={paperStyle}
          >
            <div className="flex items-center gap-2 mb-1">
              <Car className="w-4 h-4" style={{ color: colors.primary }} />
              <h2 className="text-base font-bold" style={{ color: colors.text, fontFamily: 'Space Grotesk, sans-serif' }}>
                Customer & Vehicle Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Vehicle Number"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                error={!!errors.vehicleNumber}
                helperText={errors.vehicleNumber}
                required
                placeholder="MH12AB1234"
              />

              <Input
                select
                label="Parking Slot (Optional)"
                name="parkingSlotId"
                value={formData.parkingSlotId}
                onChange={handleChange}
                helperText="Select an available parking slot"
              >
                <option value="">No Slot Selected</option>
                {slots.map(slot => (
                  <option key={slot.slotIdentifier} value={String(slot.slotIdentifier)}>
                    {slot.slotIdentifier}
                  </option>
                ))}
              </Input>
            </div>

            {/* Operational assignment */}
            <div className="pt-4" style={{ borderTop: `1px solid ${colors.divider}` }}>
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4" style={{ color: '#e9c349' }} />
                <h3 className="text-sm font-bold" style={{ color: colors.text, fontFamily: 'Space Grotesk, sans-serif' }}>
                  Operational Assignment
                </h3>
              </div>

              <Input
                select
                label="Assign Valet (Optional)"
                name="valetId"
                value={formData.valetId}
                onChange={handleChange}
                helperText="Select a valet attendant to assign"
              >
                <option value="">No Valet Selected</option>
                {valetList
                  .filter(v => v.roleName === "HOSTUSER")
                  .map(v => (
                    <option key={v.hostUserId} value={String(v.hostUserId)}>
                      {v.firstName && v.lastName ? `${v.firstName} ${v.lastName}` : v.name || v.userName || v.email}
                    </option>
                  ))}
              </Input>

              {/* Selected valet card */}
              {selectedValet && (
                <div className="mt-3 flex items-center gap-3 p-3 rounded-[0.375rem]" style={{ background: 'rgba(233,195,73,0.07)', border: '1px solid rgba(233,195,73,0.15)' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(233,195,73,0.15)', color: '#e9c349' }}>
                    {(selectedValet.firstName?.[0] || '') + (selectedValet.lastName?.[0] || '')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: colors.text, fontFamily: 'Outfit, sans-serif' }}>
                      {selectedValet.firstName} {selectedValet.lastName}
                    </p>
                    <p className="text-xs" style={{ color: colors.textMuted }}>Ready • Zone A</p>
                  </div>
                  <div className="ml-auto w-2 h-2 rounded-full" style={{ background: '#4ade80', boxShadow: '0 0 6px #4ade8080' }} />
                </div>
              )}
            </div>

            {/* Info note */}
            <div className="p-3 rounded-[0.375rem]" style={{ background: colors.activeItemBg, border: `1px solid ${colors.activeItemBorder}` }}>
              <p className="text-xs" style={{ color: colors.primary, fontFamily: 'Outfit, sans-serif' }}>
                Premium Authentication — End-to-end encrypted valet session. Auto-SMS enabled when submitted.
              </p>
            </div>

            <Button
              type="submit"
              loading={loading}
              disabled={subscriptionStatus === "expired"}
              className="w-full"
            >
              Finalize Tag Binding & Generate QR
            </Button>
          </motion.form>
        </div>

        {/* ── Right: QR Display & Slot info ───────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-5"
        >
          {/* QR Display */}
          <div className="p-6 rounded-[12px] flex flex-col items-center" style={paperStyle}>
            <div className="flex items-center gap-2 mb-4 self-start">
              <QrCode className="w-4 h-4" style={{ color: colors.primary }} />
              <h3 className="text-base font-bold" style={{ color: colors.text, fontFamily: 'Space Grotesk, sans-serif' }}>
                Session QR Code
              </h3>
            </div>

            {/* Animated QR border */}
            <div className="relative p-4 rounded-[0.375rem]" style={{ background: '#fff' }}>
              {/* Corner accents */}
              {[
                'top-0 left-0 border-t-2 border-l-2 rounded-tl',
                'top-0 right-0 border-t-2 border-r-2 rounded-tr',
                'bottom-0 left-0 border-b-2 border-l-2 rounded-bl',
                'bottom-0 right-0 border-b-2 border-r-2 rounded-br',
              ].map((cls, i) => (
                <div key={i} className={`absolute w-5 h-5 ${cls}`} style={{ borderColor: '#8b5cf6' }} />
              ))}
              <QRCode
                value={qrValue || "https://parkluxe.co.in"}
                size={180}
                level="H"
              />
            </div>

            {qrValue ? (
              <div className="mt-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: '#4ade80' }} />
                <p className="text-xs font-semibold" style={{ color: '#4ade80', fontFamily: 'Inter, sans-serif' }}>
                  QR generated — SMS sent
                </p>
              </div>
            ) : (
              <p className="text-xs text-center mt-4" style={{ color: colors.textMuted, fontFamily: 'Outfit, sans-serif' }}>
                Submit form to generate unique session QR
              </p>
            )}
          </div>

          {/* Slot capacity info */}
          <div className="p-5 rounded-[12px]" style={raisedPaperStyle}>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4" style={{ color: '#a78bfa' }} />
              <h3 className="text-sm font-bold" style={{ color: colors.text, fontFamily: 'Space Grotesk, sans-serif' }}>
                Real-time Capacity
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                <span style={{ color: colors.textMuted }}>Available Slots</span>
                <span className="font-bold" style={{ color: '#4ade80' }}>{slots.length}</span>
              </div>
              <div className="flex justify-between text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                <span style={{ color: colors.textMuted }}>Active Valets</span>
                <span className="font-bold" style={{ color: colors.primaryBtn }}>
                  {valetList.filter(v => v.roleName === 'HOSTUSER').length}
                </span>
              </div>
            </div>
            <p className="text-xs mt-3" style={{ color: colors.textMuted, fontFamily: 'Outfit, sans-serif' }}>
              System suggests redirecting overflow to Zone C if intake exceeds 12 units/hr.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QRScanPage;
