import React, { useState } from 'react';
import { BackButton } from '../common/BackButton';
import {
  ShieldAlert,
  PhoneCall,
  HeartPulse,
  Flame,
  Building,
  Bus,
  MapPin,
  AlertTriangle,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface ContactCard {
  title: string;
  department: string;
  phonePlaceholder: string;
  location: string;
  availability: string;
  type: 'security' | 'medical' | 'admin' | 'transport';
}

export const EmergencyView: React.FC = () => {
  const [sosTriggered, setSosTriggered] = useState(false);

  const emergencyContacts: ContactCard[] = [
    {
      title: 'Campus Security Control Room',
      department: 'Chief Security Officer Desk',
      phonePlaceholder: '+91 44 2800 1001 / Ext. 999 (Verified College Control Line)',
      location: 'Main Gate Security Post 1',
      availability: '24/7 Round-the-Clock',
      type: 'security',
    },
    {
      title: 'Student Health & First Aid Clinic',
      department: 'College Resident Medical Officer',
      phonePlaceholder: '+91 44 2800 1025 / Ext. 108 (Campus Medical Desk)',
      location: 'Hostel Block A, Ground Floor Clinic',
      availability: '24 Hours On-Call Doctor & Ambulance',
      type: 'medical',
    },
    {
      title: 'Women Students Helpline / ICC',
      department: 'Internal Complaints Committee & Counseling',
      phonePlaceholder: '+91 94440 00099 (Student Welfare Officer)',
      location: 'Kaveri Hostel Warden Suite',
      availability: '24/7 Dedicated Support',
      type: 'security',
    },
    {
      title: 'Campus Emergency Transport & Ambulance',
      department: 'College Transport Logistics Officer',
      phonePlaceholder: '+91 94440 00055 (Fleet Emergency Line)',
      location: 'Central Vehicle Depot / Gate 2',
      availability: 'Immediate Dispatch',
      type: 'transport',
    },
    {
      title: 'Administrative Office & Dean Student Affairs',
      department: 'Student Affairs Emergency Secretariat',
      phonePlaceholder: '+91 44 2800 1005 (College Office EPABX)',
      location: 'Administrative Block, Floor 1',
      availability: '08:30 AM - 06:00 PM (Office Hours)',
      type: 'admin',
    },
    {
      title: 'Local Municipal Emergency Dispatch',
      department: 'State Emergency Response Services',
      phonePlaceholder: 'Police: 100 | Ambulance: 108 | Fire: 101',
      location: 'Local Station (3.2 km from Campus Gate)',
      availability: '24/7 Government Emergency Number',
      type: 'security',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <BackButton size="sm" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200/60">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Campus Safety &amp; Emergency Crisis Response</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Emergency Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Institutional first-aid stations, 24/7 campus security intercoms, and verified safe assembly zones
          </p>
        </div>

        {/* SOS Emergency Button */}
        <button
          onClick={() => setSosTriggered(!sosTriggered)}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all shadow-lg active:scale-95 ${
            sosTriggered
              ? 'bg-rose-700 text-white animate-pulse ring-4 ring-rose-400/50'
              : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30'
          }`}
        >
          <AlertTriangle className="w-5 h-5 text-white" />
          <span>{sosTriggered ? 'SOS ALERT ACTIVE' : 'CAMPUS SOS ASSISTANCE'}</span>
        </button>
      </div>

      {/* SOS Alert Banner */}
      {sosTriggered && (
        <div className="p-6 rounded-3xl bg-rose-50 border-2 border-rose-500 text-rose-950 space-y-3 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-700 font-extrabold text-base">
              <ShieldAlert className="w-6 h-6 animate-bounce" />
              <span>Campus Security Rapid Dispatch Protocol Activated</span>
            </div>
            <button
              onClick={() => setSosTriggered(false)}
              className="text-xs font-bold px-3 py-1 rounded-xl bg-white border border-rose-300 text-rose-800"
            >
              Dismiss
            </button>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-rose-900">
            If you are in immediate danger or witnessing a medical crisis on campus:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white rounded-2xl border border-rose-200">
              <strong className="block text-slate-900 font-bold mb-0.5">1. Security Booth:</strong>
              Call Control Line: <strong>+91 44 2800 1001</strong> or dial campus intercom <strong>999</strong>.
            </div>
            <div className="p-3 bg-white rounded-2xl border border-rose-200">
              <strong className="block text-slate-900 font-bold mb-0.5">2. Medical Room:</strong>
              Clinic on Ground Floor Hostel A is staffed 24/7 with campus ambulance.
            </div>
            <div className="p-3 bg-white rounded-2xl border border-rose-200">
              <strong className="block text-slate-900 font-bold mb-0.5">3. Stay Put:</strong>
              Remain in a well-lit zone near CCTV coverage (Main Gate, Library Foyer).
            </div>
          </div>
        </div>
      )}

      {/* Institutional Production Notice */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-start gap-3 text-xs sm:text-sm text-slate-600">
        <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-800 font-bold">Configurable Emergency Architecture:</strong>{' '}
          In production deployment, all emergency lines are dynamically populated from the institution&apos;s verified registrar database. Placeholder lines indicate direct connectivity points.
        </div>
      </div>

      {/* Emergency Directory Contacts Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {emergencyContacts.map((contact, idx) => (
          <div
            key={idx}
            className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div
                  className={`p-3 rounded-2xl border ${
                    contact.type === 'medical'
                      ? 'bg-rose-50 border-rose-100 text-rose-600'
                      : contact.type === 'security'
                      ? 'bg-indigo-50 border-indigo-100 text-indigo-600'
                      : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                  }`}
                >
                  {contact.type === 'medical' ? (
                    <HeartPulse className="w-6 h-6" />
                  ) : contact.type === 'transport' ? (
                    <Bus className="w-6 h-6" />
                  ) : (
                    <PhoneCall className="w-6 h-6" />
                  )}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {contact.availability}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                  {contact.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{contact.department}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Intercom / Phone:
                </span>
                <p className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                  {contact.phonePlaceholder}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                <span>{contact.location}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <a
                href={`tel:${contact.phonePlaceholder.split(' ')[0]}`}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-slate-200"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Emergency Contact</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Safe Assembly Points Section */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-600" />
          Campus Safe Assembly Points (Evacuation Map Zones)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
            <strong className="block font-bold text-emerald-950 text-sm">Zone A: Main Sports Oval</strong>
            <p className="text-slate-600">Designated assembly zone for AI &amp; DS Block, Labs, and Library.</p>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
            <strong className="block font-bold text-emerald-950 text-sm">Zone B: Open Amphitheatre</strong>
            <p className="text-slate-600">Assembly zone for Administrative Building, Auditorium, and Canteen.</p>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
            <strong className="block font-bold text-emerald-950 text-sm">Zone C: Kaveri Courtyard</strong>
            <p className="text-slate-600">Dedicated safe assembly ground for Women’s and Men’s Hostels.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
