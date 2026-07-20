'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axiosInstance from '@/services/api/axiosInstance';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';

interface PackageDetails {
  id: string;
  name: string;
  description: string;
  budget: string;
  scope: string;
  required_experience: string | null;
  timeline_start: string | null;
  timeline_end: string | null;
  project_name: string;
  project_description: string;
  project_location: string;
  project_property_type: string | null;
  builder_name: string;
  builder_trust_score: string;
  skills: string[] | null;
}

const PackageBiddingPage = () => {
  const router = useRouter();
  const { packageId } = useParams();

  const [details, setDetails] = useState<PackageDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Bidding Form Fields
  const [proposedBudget, setProposedBudget] = useState('');
  const [timelineStart, setTimelineStart] = useState('');
  const [timelineEnd, setTimelineEnd] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        setLoading(true);
        const res = (await axiosInstance.get(`/discovery/packages/${packageId}`)) as any;
        if (res.success) {
          setDetails(res.data);
          // Set timeline placeholders if present in builder specs
          if (res.data.timeline_start) {
            setTimelineStart(res.data.timeline_start.split('T')[0]);
          }
          if (res.data.timeline_end) {
            setTimelineEnd(res.data.timeline_end.split('T')[0]);
          }
        }
      } catch (err: any) {
        setErrorMsg(err?.message || 'Failed to retrieve work package specifications.');
      } finally {
        setLoading(false);
      }
    };

    if (packageId) {
      fetchPackageDetails();
    }
  }, [packageId]);

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const budgetVal = parseFloat(proposedBudget);
    if (!budgetVal || budgetVal <= 0) {
      setErrorMsg('Proposed budget must be a positive number.');
      return;
    }

    if (!timelineStart || !timelineEnd) {
      setErrorMsg('Please specify both timeline start and end parameters.');
      return;
    }

    setSaving(true);
    try {
      const res = (await axiosInstance.post(`/discovery/packages/${packageId}/bid`, {
        proposed_budget: budgetVal,
        proposed_timeline_start: timelineStart,
        proposed_timeline_end: timelineEnd,
        proposal_notes: notes,
        breakdown: [
          {
            item: `${details?.name || 'Project Package Bid Allocation'}`,
            quantity: 1,
            unit: 'LumpSum',
            rate: budgetVal,
            total: budgetVal
          }
        ]
      })) as any;

      if (res.success) {
        setSuccessMsg('Your quotation bid has been successfully submitted to the builder!');
        setTimeout(() => {
          router.push('/contractor/applications');
        }, 1500);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to submit quotation proposal.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (errorMsg && !details) {
    return (
      <div className="p-6 bg-red-950/20 border border-red-900/30 rounded-2xl text-red-400 max-w-lg mx-auto">
        <h3 className="font-bold text-lg mb-1 font-sans">Specifications Error</h3>
        <p className="text-sm">{errorMsg}</p>
        <Button onClick={() => router.push('/contractor/discovery')} variant="outline" className="mt-4 border-red-500/30 text-red-300">
          Back to Discovery Board
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col gap-2 border-b border-slate-800/40 pb-6">
        <button
          onClick={() => router.push('/contractor/discovery')}
          className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-semibold transition-colors w-fit"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Bidding Board
        </button>
        <h1 className="text-3xl font-bold tracking-tight text-white font-sans">Submit Work Proposal</h1>
        <p className="text-slate-400 text-sm">Review package requirements and compile your cost breakdown quotation</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {details && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* LEFT COLUMN: PACKAGE SPECIFICATIONS */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Package Requirements</CardTitle>
                <CardDescription>Published by {details.builder_name} ({Math.round(Number(details.builder_trust_score))}% verified)</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 text-slate-300 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Project Category</span>
                  <span className="text-white font-bold text-sm block mt-0.5">{details.project_name}</span>
                  <span className="text-slate-400 mt-1 block">Location: {details.project_location}</span>
                </div>

                <div className="border-t border-slate-800/40 pt-4">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Package Name</span>
                  <span className="text-indigo-400 font-extrabold text-sm block mt-0.5">{details.name}</span>
                </div>

                <div className="border-t border-slate-800/40 pt-4">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Package Budget limit</span>
                  <span className="text-purple-400 font-extrabold text-base block mt-0.5">₹{Number(details.budget).toLocaleString('en-IN')}</span>
                </div>

                <div className="border-t border-slate-800/40 pt-4">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Required Contractor Experience</span>
                  <span className="text-slate-200 font-semibold block mt-0.5">{details.required_experience || 'Open to all experience levels'}</span>
                </div>

                <div className="border-t border-slate-800/40 pt-4">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Scope of Work</span>
                  <p className="mt-1 leading-relaxed text-slate-400">{details.scope}</p>
                </div>

                {details.skills && details.skills.length > 0 && (
                  <div className="border-t border-slate-800/40 pt-4">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold mb-1.5">Required Skills / trades</span>
                    <div className="flex flex-wrap gap-1.5">
                      {details.skills.map((skill, idx) => (
                        <Badge key={idx} variant="glass" size="sm" className="border-purple-500/20 text-purple-300">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: PROPOSAL BID FORM */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Proposal Form</CardTitle>
                <CardDescription>Itemize costs to match your bidding budget</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitBid} className="flex flex-col gap-6">
                  {/* Budget and timeline parameters */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="Proposed Budget (INR)"
                      type="number"
                      placeholder="E.g. 500000"
                      value={proposedBudget}
                      onChange={(e) => setProposedBudget(e.target.value)}
                      disabled={saving}
                      required
                    />
                    <Input
                      label="Est. Start Date"
                      type="date"
                      value={timelineStart}
                      onChange={(e) => setTimelineStart(e.target.value)}
                      disabled={saving}
                      required
                    />
                    <Input
                      label="Est. End Date"
                      type="date"
                      value={timelineEnd}
                      onChange={(e) => setTimelineEnd(e.target.value)}
                      disabled={saving}
                      required
                    />
                  </div>

                  {/* Proposal notes */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400">Proposal Description & Notes</label>
                    <textarea
                      placeholder="Outline your methodologies, machinery to be deployed, or safety assurances..."
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      disabled={saving}
                      className="w-full bg-slate-900/60 border border-slate-800 focus:border-purple-500/80 focus:ring-purple-500/30 focus:ring-4 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 outline-none transition-all duration-300 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    loading={saving}
                    disabled={saving}
                    className="mt-4"
                  >
                    File Work Proposal
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageBiddingPage;
