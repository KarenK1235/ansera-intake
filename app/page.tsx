"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowUp, FileDown, Home } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  email: z.string().email("Invalid email address"),
  secondaryEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  websiteUrl: z.string().optional(),
  primaryPhone: z.string().min(1, "Primary phone is required"),
  secondaryPhone: z.string().optional(),
  primaryBusinessType: z.string().optional(),
  socialFacebook: z.string().optional(),
  socialInstagram: z.string().optional(),
  socialYoutube: z.string().optional(),
  socialLinkedin: z.string().optional(),
  socialOther1: z.string().optional(),
  socialOther2: z.string().optional(),
  hipaaRegulated: z.string().optional(),
  discloseAi: z.string().optional(),
  minorsMayCall: z.string().optional(),
  topReasons: z.string().optional(),
  questionsAskedMost: z.string().optional(),
  callsCannotMiss: z.string().optional(),
  situationsStress: z.string().optional(),
  callsNeverAlone: z.string().optional(),
  commonFrustrations: z.string().optional(),
  ringsBeforePickup: z.string().optional(),
  businessModel: z.string().optional(),
  urgentCallsSamePerson: z.string().optional(),
  selectedPlan: z.string().optional(),
  advancedOptions: z.array(z.string()).optional(),
  voiceGender: z.string().optional(),
  voicePersonaName: z.string().optional(),
  languagesNeeded: z.string().optional(),
  autoDetectLanguage: z.boolean().optional(),
  deliveryEmailEnabled: z.boolean().optional(),
  deliveryEmail: z.string().optional(),
  deliveryTextEnabled: z.boolean().optional(),
  deliveryText: z.string().optional(),
  deliveryOtherEnabled: z.boolean().optional(),
  deliveryOther: z.string().optional(),
  callerNeedsAssistance: z.string().optional(),
  refGoogleBusiness: z.boolean().optional(),
  refGoogleBusinessUrl: z.string().optional(),
  refSop: z.boolean().optional(),
  refSopUrl: z.string().optional(),
  refSopFile: z.string().optional(),
  refScripts: z.boolean().optional(),
  refScriptsUrl: z.string().optional(),
  refScriptsFile: z.string().optional(),
  refScriptsText: z.string().optional(),
  refServices: z.boolean().optional(),
  refServicesUrl: z.string().optional(),
  refServicesFile: z.string().optional(),
  refStaff: z.boolean().optional(),
  refStaffText: z.string().optional(),
  refOther: z.boolean().optional(),
  refOtherDesc: z.string().optional(),
  refOtherUrl: z.string().optional(),
  refOtherFile: z.string().optional(),
  refOtherText: z.string().optional(),
  bookingSystem: z.string().optional(),
  anythingElse: z.string().optional(),
  authorization: z.boolean().refine(val => val === true, "You must agree to the terms"),
});

type FormValues = z.infer<typeof formSchema>;

const TooltipLabel = ({ children, tooltip, className = "" }: { children: React.ReactNode, tooltip?: string, className?: string }) => (
  <Label className={`text-[11px] font-bold text-gray-600 uppercase flex items-center gap-1.5 ${className}`}>
    {children}
    {tooltip && (
      <Tooltip>
        <TooltipTrigger className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#CFA911] text-[9px] font-bold text-white hover:bg-[#b5930e] transition-colors">?</TooltipTrigger>
        <TooltipContent><p className="text-xs max-w-[200px] font-normal normal-case">{tooltip}</p></TooltipContent>
      </Tooltip>
    )}
  </Label>
);

const Index = () => {

  const [showTopBtn, setShowTopBtn] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      advancedOptions: [],
      hipaaRegulated: "",
      discloseAi: "",
      minorsMayCall: "",
      urgentCallsSamePerson: "",
      callerNeedsAssistance: "",
    }
  });

  const onSubmit = async (data: FormValues) => {
    const snapshotId = crypto.randomUUID();
    const submissionUrl = `${window.location.origin}${window.location.pathname}?snapshot=${snapshotId}`;
    try {
      localStorage.setItem(`ansera_snapshot_${snapshotId}`, JSON.stringify(data));
      localStorage.setItem(`ansera_snapshot_latest`, JSON.stringify(data));
      localStorage.setItem(`ansera_snapshot_latest_url`, submissionUrl);
    } catch (e) {}

    const trackingPayload = {
      type: "external_form_submission",
      timestamp: Date.now(),
      formId: "Ansera™ Client Intake Form",
      formData: {
        first_name: data.contactName,
        organization: data.companyName,
        email: data.email,
        phone: data.primaryPhone,
        website: data.websiteUrl,
        "contact.secondary_email": data.secondaryEmail,
        "contact.secondary_phone": data.secondaryPhone,
        "contact.core_business_type": data.primaryBusinessType,
        "contact.hipaa_regulated": data.hipaaRegulated,
        "contact.disclose_ai": data.discloseAi,
        "contact.minors_may_call": data.minorsMayCall,
        "contact.top_reasons_people_call": data.topReasons,
        "contact.questions_asked_most": data.questionsAskedMost,
        "contact.calls_that_cannot_miss": data.callsCannotMiss,
        "contact.situations_that_stress_staff": data.situationsStress,
        "contact.calls_never_alone": data.callsNeverAlone,
        "contact.common_frustrations": data.commonFrustrations,
        "contact.rings_before_pickup": data.ringsBeforePickup,
        "contact.business_model": data.businessModel,
        "contact.selected_plan": data.selectedPlan,
        "contact.advanced_options": data.advancedOptions?.join(", "),
        "contact.voice_gender": data.voiceGender,
        "contact.voice_persona_name": data.voicePersonaName,
        "contact.languages_needed": data.languagesNeeded,
        "contact.auto_detect_language": data.autoDetectLanguage ? "Yes" : "No",
        "contact.caller_needs_assistance": data.callerNeedsAssistance,
        "contact.booking_system": data.bookingSystem,
        "contact.ref_google_business": data.refGoogleBusinessUrl,
        "contact.ref_sop": data.refSopFile || data.refSopUrl,
        "contact.ref_scripts": data.refScriptsFile || data.refScriptsUrl || data.refScriptsText,
        "contact.ref_services": data.refServicesFile || data.refServicesUrl,
        "contact.ref_staff": data.refStaffText,
        "contact.ref_other": data.refOtherFile || data.refOtherUrl || data.refOtherText,
        "contact.anything_else": data.anythingElse
      },
      formLabels: {
        first_name: "Contact Name",
        organization: "Company Name",
        email: "Email Address",
        phone: "Primary Phone",
        website: "Website URL"
      },
      url: submissionUrl,
      trackingId: "tk_59bf9b7f0f2d40209c3c006347f788a6",
      locationId: "IN0lqUaJgKf0SviBbxHD",
      sessionId: crypto.randomUUID(),
    };

    fetch("https://backend.leadconnectorhq.com/external-tracking/events", {
      method: "POST",
      headers: { "Content-Type": "application/json", version: "2021-07-28" },
      body: JSON.stringify(trackingPayload),
    }).catch(() => {});

    toast.success("Form submitted successfully!");

  };

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const snapshotId = params.get("snapshot");
      const stateSnapshot = location.state?.snapshotData;
      
      if (stateSnapshot) {
        form.reset(stateSnapshot);
        setIsReadOnly(true);
        return;
      }

      if (snapshotId) {
        const key = snapshotId === 'latest' ? 'ansera_snapshot_latest' : `ansera_snapshot_${snapshotId}`;
        const savedSnapshot = localStorage.getItem(key);
        if (savedSnapshot) {
          form.reset(JSON.parse(savedSnapshot));
          setIsReadOnly(true);
          return;
        }
      }

      const saved = localStorage.getItem("ansera_form_data_v2");
      if (saved && !isReadOnly) {
        form.reset(JSON.parse(saved));
      }
    } catch (e) {}
  }, [form, location.search, location.state]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      try { localStorage.setItem("ansera_form_data_v2", JSON.stringify(value)); } catch (e) {}
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen bg-[#EBEBEB] py-4 font-sans text-sm">
      <div className="mx-auto max-w-5xl bg-white shadow-xl">
        {/* Header */}
        <header className="flex items-center justify-between border-b-4 border-[#C8102E] px-8 py-3">
          <div className="flex items-center gap-4">
            <img src="https://vibe.filesafe.space/1778392325118817481/attachments/3bd1338d-c721-4458-a57a-7da838dbf84e.jpg" alt="Otto Growth Labs" className="h-16 object-contain" />
            <div className="flex flex-col justify-center">
              <h1 className="text-sm font-bold tracking-wider text-gray-900 leading-tight">OTTO GROWTH LABS</h1>
              <p className="text-xs text-[#C8102E] leading-tight">Ansera™ AI Phone Agent</p>
            </div>
          </div>
          <div className="text-right flex flex-col justify-center items-end">
            <div className="flex gap-2 mb-2 print:hidden">
              <Button type="button" variant="outline" size="sm" className="h-7 text-[10px] uppercase tracking-wider" onClick={() => window.print()}>
                Print Form
              </Button>
            </div>
            <p className="text-lg font-bold text-[#C8102E] leading-tight">559.801.1235</p>
            <p className="text-xs text-gray-600 leading-tight mt-1">Hello@OttoGrowthLabs.com</p>
          </div>
        </header>

        <div className="bg-[#333333] px-8 py-2 text-center text-white">
          <h2 className="text-xl font-bold tracking-widest text-[#FFC72C]">ANSERA™ CLIENT INTAKE FORM</h2>
          <p className="text-xs text-gray-300">Please complete all required fields. Your information helps us prepare the right solution for your business.</p>
        </div>

        {isReadOnly && (
          <div className="bg-[#fffbea] border-y-4 border-[#CFA911] px-8 py-4 flex items-center justify-between print:hidden">
            <div>
              <h2 className="text-[#C8102E] font-bold text-lg tracking-wider">READ-ONLY SNAPSHOT</h2>
              <p className="text-gray-700 text-xs mt-1">You are viewing a saved copy of a submitted form. Editing is disabled.</p>
            </div>
            <Button type="button" onClick={() => window.print()} className="bg-[#C8102E] hover:bg-[#a00d25] text-white font-bold tracking-wider text-xs">
              PRINT SNAPSHOT
            </Button>
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className={`px-8 py-3 space-y-3 ${isReadOnly ? '[&_input]:pointer-events-none [&_textarea]:pointer-events-none [&_select]:pointer-events-none [&_button]:pointer-events-none [&_label]:pointer-events-none opacity-95' : ''}`}>
          
          {/* Section 1 */}
          <section>
            <div className="mb-2 flex items-center gap-2 bg-[#333333] px-3 py-1.5 text-white">
              <span className="flex h-5 w-5 items-center justify-center bg-[#C8102E] text-xs font-bold">1</span>
              <h3 className="text-sm font-bold tracking-widest uppercase">Contact & Business Information</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-x-4 gap-y-1.5 md:grid-cols-2">
              <div className="space-y-0.5">
                <TooltipLabel tooltip="The exact legal or DBA name callers know you by.">* COMPANY NAME</TooltipLabel>
                <Input {...form.register("companyName")} placeholder="As callers know it" className="h-7 text-xs bg-gray-50 focus:bg-[#fff5f7] focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E]" />
              </div>
              <div className="space-y-0.5">
                <TooltipLabel tooltip="The primary point of contact for this account.">* CONTACT NAME</TooltipLabel>
                <Input {...form.register("contactName")} placeholder="Your full name" className="h-7 text-xs bg-gray-50 focus:bg-[#fff5f7] focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E]" />
              </div>
              <div className="space-y-0.5">
                <TooltipLabel tooltip="Where we should send your proposal.">* EMAIL ADDRESS</TooltipLabel>
                <Input {...form.register("email")} type="email" placeholder="your@email.com" className="h-7 text-xs bg-gray-50 focus:bg-[#fff5f7] focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E]" />
              </div>
              <div className="space-y-0.5">
                <TooltipLabel tooltip="Used strictly for order updates.">SECONDARY EMAIL ADDRESS</TooltipLabel>
                <Input {...form.register("secondaryEmail")} type="email" placeholder="updates@yourbusiness.com" className="h-7 text-xs bg-gray-50 focus:bg-[#fff5f7] focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E]" />
              </div>
              <div className="space-y-0.5">
                <TooltipLabel tooltip="Main business number.">* PRIMARY PHONE</TooltipLabel>
                <Input {...form.register("primaryPhone")} placeholder="775.429.7900" className="h-7 text-xs bg-gray-50 focus:bg-[#fff5f7] focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E]" />
              </div>
              <div className="space-y-0.5">
                <TooltipLabel tooltip="Alternate number.">SECONDARY PHONE</TooltipLabel>
                <Input {...form.register("secondaryPhone")} placeholder="775.429.7900" className="h-7 text-xs bg-gray-50 focus:bg-[#fff5f7] focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E]" />
              </div>
              <div className="space-y-0.5">
                <TooltipLabel tooltip="Core industry.">PRIMARY BUSINESS TYPE</TooltipLabel>
                <Input {...form.register("primaryBusinessType")} placeholder="e.g. Dental Office" className="h-7 text-xs bg-gray-50 focus:bg-[#fff5f7] focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E]" />
              </div>
              <div className="space-y-0.5">
                <TooltipLabel tooltip="Main website URL.">WEBSITE URL</TooltipLabel>
                <Input {...form.register("websiteUrl")} placeholder="https://www.yourbusiness.com" className="h-7 text-xs bg-gray-50 focus:bg-[#fff5f7] focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E]" />
              </div>
            </div>

            <div className="mt-2 grid grid-cols-1 gap-2.5 md:grid-cols-2">
              <div>
                <div className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-gray-600">Social Media Profiles</div>
                <div className="space-y-1">
                  {[
                    { id: "socialFacebook", icon: "https://vibe.filesafe.space/1778392325118817481/attachments/fb.svg", placeholder: "Facebook URL" },
                    { id: "socialInstagram", icon: "https://vibe.filesafe.space/1778392325118817481/attachments/ig.svg", placeholder: "Instagram URL" },
                    { id: "socialYoutube", icon: "https://vibe.filesafe.space/1778392325118817481/attachments/yt.svg", placeholder: "YouTube URL" },
                    { id: "socialLinkedin", icon: "https://vibe.filesafe.space/1778392325118817481/attachments/li.svg", placeholder: "LinkedIn URL" },
                    { id: "socialOther1", icon: "https://vibe.filesafe.space/1778392325118817481/attachments/link.svg", placeholder: "Other URL" },
                    { id: "socialOther2", icon: "https://vibe.filesafe.space/1778392325118817481/attachments/link.svg", placeholder: "Other URL" }
                  ].map(s => (
                    <div key={s.id} className="flex items-center gap-2 rounded-[3px] border border-gray-200 bg-gray-50 px-2.5 py-1.5 focus-within:bg-[#fff5f7] focus-within:border-[#C8102E] focus-within:ring-1 focus-within:ring-[#C8102E]">
                      <img src={s.icon} className="h-4 w-4 shrink-0" alt="" />
                      <input {...form.register(s.id as any)} placeholder={s.placeholder} className="w-full bg-transparent text-[11px] outline-none" />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-gray-600">Hours of Operation</div>
                <div className="border border-[#E0DED8] rounded overflow-hidden">
                  {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, i) => (
                    <div key={day} className={`grid grid-cols-[64px_1fr_1fr_48px] items-center gap-1 px-1.5 py-1 ${i !== 6 ? 'border-b border-[#f0efed]' : ''} bg-white`}>
                      <div className="font-semibold text-[10px] text-gray-700">{day}</div>
                      <select className="rounded-[2px] border border-gray-200 bg-white px-1 py-0.5 text-[9px] text-gray-800 outline-none focus:bg-[#fff5f7] focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E]">
                        <option>--</option><option>8:00 AM</option><option>9:00 AM</option>
                      </select>
                      <select className="rounded-[2px] border border-gray-200 bg-white px-1 py-0.5 text-[9px] text-gray-800 outline-none focus:bg-[#fff5f7] focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E]">
                        <option>--</option><option>5:00 PM</option><option>6:00 PM</option>
                      </select>
                      <label className="flex cursor-pointer items-center justify-center gap-1 text-[9px] text-gray-400">
                        <input type="checkbox" className="h-3 w-3 accent-[#C8102E]" />
                        Closed
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
              {['hipaaRegulated', 'discloseAi', 'minorsMayCall'].map((f) => (
                <div key={f} className="rounded-[3px] border border-[#e8e6e0] bg-gray-50 p-1.5">
                  <div className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-gray-600">{f === 'hipaaRegulated' ? 'HIPAA Regulated?' : f === 'discloseAi' ? 'Disclose AI to Callers?' : 'Minors May Call?'}</div>
                  <RadioGroup onValueChange={(val) => form.setValue(f as any, val)} value={form.watch(f as any)} className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <RadioGroupItem value="yes" id={`${f}-yes`} className="h-3 w-3 text-[#C8102E] border-gray-400" />
                      <Label htmlFor={`${f}-yes`} className="text-[10px] font-normal text-gray-700 cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center gap-1">
                      <RadioGroupItem value="no" id={`${f}-no`} className="h-3 w-3 text-[#C8102E] border-gray-400" />
                      <Label htmlFor={`${f}-no`} className="text-[10px] font-normal text-gray-700 cursor-pointer">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <div className="mb-2 flex items-center gap-2 bg-[#333333] px-3 py-1.5 text-white">
              <span className="flex h-5 w-5 items-center justify-center bg-[#C8102E] text-xs font-bold">2</span>
              <h3 className="text-sm font-bold tracking-widest uppercase">Call Flow & Priority Situations</h3>
            </div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-1.5 md:grid-cols-2">
              {[
                { id: "topReasons", label: "1. TOP REASONS PEOPLE CALL" },
                { id: "questionsAskedMost", label: "2. QUESTIONS CALLERS ASK MOST" },
                { id: "callsCannotMiss", label: "3. CALLS THAT CANNOT BE MISSED" },
                { id: "situationsStress", label: "4. SITUATIONS THAT STRESS STAFF" },
                { id: "callsNeverAlone", label: "5. CALLS NEVER TO HANDLE ALONE" },
                { id: "commonFrustrations", label: "6. COMMON CALLER FRUSTRATIONS" }
              ].map((q) => (
                <div key={q.id} className="space-y-0.5">
                  <TooltipLabel>{q.label}</TooltipLabel>
                  <Textarea {...form.register(q.id as any)} className="h-7 min-h-[28px] resize-y text-xs bg-gray-50 py-1 focus:bg-[#fff5f7] focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E]" />
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-0.5">
                <TooltipLabel>RINGS BEFORE PICKUP</TooltipLabel>
                <Select onValueChange={(val) => form.setValue("ringsBeforePickup", val)} value={form.watch("ringsBeforePickup")}>
                  <SelectTrigger className="h-7 text-xs bg-gray-50 focus:bg-[#fff5f7] focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E]"><SelectValue placeholder="-- Choose --" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1 Ring">1 Ring</SelectItem>
                    <SelectItem value="2 Rings">2 Rings</SelectItem>
                    <SelectItem value="3 Rings (Recommended)">3 Rings (Recommended)</SelectItem>
                    <SelectItem value="4 Rings (Recommended)">4 Rings (Recommended)</SelectItem>
                    <SelectItem value="5 Rings">5 Rings</SelectItem>
                    <SelectItem value="6 Rings">6 Rings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-0.5">
                <TooltipLabel>BUSINESS MODEL</TooltipLabel>
                <Select onValueChange={(val) => form.setValue("businessModel", val)} value={form.watch("businessModel")}>
                  <SelectTrigger className="h-7 text-xs bg-gray-50 focus:bg-[#fff5f7] focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E]"><SelectValue placeholder="-- Choose --" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Customers come to us">Customers come to us</SelectItem>
                    <SelectItem value="Virtual / Online Business">Virtual / Online Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <div className="mb-3 flex items-center gap-2 bg-[#333333] px-3 py-1.5 text-white">
              <span className="flex h-5 w-5 items-center justify-center bg-[#C8102E] text-xs font-bold">3</span>
              <h3 className="text-sm font-bold tracking-widest uppercase">Select Your Ansera™ Plan</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {['assist', 'elite', 'advanced'].map(plan => (
                <div key={plan} className={`flex flex-col rounded-md border-2 overflow-hidden transition-all ${form.watch("selectedPlan") === plan ? 'border-[#C8102E] bg-[#fff5f7]' : 'border-[#e0ded8] bg-white'}`}>
                  <div className={`px-3.5 py-2.5 text-white flex justify-between items-center ${plan === 'assist' ? 'bg-gradient-to-br from-[#6B6B6B] to-[#3A3A3A]' : plan === 'elite' ? 'bg-gradient-to-br from-[#C8102E] to-[#8A0E1F]' : 'bg-gradient-to-br from-[#CFA911] to-[#8A6E00]'}`}>
                    <span className="text-lg font-bold uppercase">{plan === 'assist' ? 'Assist+' : plan}</span>
                    <span className="text-[8px] bg-white/20 px-2 py-0.5 rounded-full uppercase font-bold">{plan === 'assist' ? 'Standard' : plan === 'elite' ? 'Most Popular' : 'Your Build'}</span>
                  </div>
                  <div className="p-3.5 flex flex-col flex-1">
                    <div className="flex-1 space-y-1.5 mb-3 text-[10px] text-gray-600">
                      {plan === 'advanced' ? (
                        <div className="space-y-1">
                          {["Rescheduling", "Multi-location Routing", "Service Area Qualification", "Multilingual Support"].map(f => (
                            <label key={f} className="flex gap-2 items-start cursor-pointer">
                              <input type="checkbox" className="accent-[#C8102E] mt-0.5" onChange={(e) => {
                                const current = form.getValues("advancedOptions") || [];
                                form.setValue("advancedOptions", e.target.checked ? [...current, f] : current.filter(v => v !== f));
                                if (e.target.checked) form.setValue("selectedPlan", "advanced");
                              }} />
                              <span>{f}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <>
                          <div className="flex gap-1.5"><span className="text-[#C8102E]">✓</span> 24/7 Call Handling</div>
                          <div className="flex gap-1.5"><span className="text-[#C8102E]">✓</span> Personalized Greeting</div>
                          <div className="flex gap-1.5"><span className="text-[#C8102E]">✓</span> Instant Notifications</div>
                          {plan === 'elite' && <div className="flex gap-1.5"><span className="text-[#C8102E]">✓</span> Language Detection</div>}
                        </>
                      )}
                    </div>
                    <Button type="button" onClick={() => form.setValue("selectedPlan", plan)} className={`w-full text-[11px] font-bold uppercase py-2 h-auto ${form.watch("selectedPlan") === plan ? 'bg-[#C8102E] text-white' : 'bg-white text-[#C8102E] border-2 border-[#C8102E] hover:bg-[#C8102E] hover:text-white'}`}>
                      Select {plan === 'assist' ? 'Assist+' : plan}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <div className="mb-2 flex items-center gap-2 bg-[#333333] px-3 py-1.5 text-white">
              <span className="flex h-5 w-5 items-center justify-center bg-[#C8102E] text-xs font-bold">6</span>
              <h3 className="text-sm font-bold tracking-widest uppercase">Reference Materials</h3>
            </div>
            
            <p className="text-[10px] color-[#888] italic mb-2 px-1">
              All items in this section are optional. Share what you have today — more can always be added later.
            </p>

            <div className="bg-[#fffbea] border-l-4 border-[#CFA911] p-3 text-[11px] text-[#555] leading-relaxed mb-4 flex items-start gap-2">
              <div className="flex-1">
                <strong>The more you share, the smarter Ansera™ becomes.</strong> Upload whatever applies. Can't upload? Paste a link, upload a ZIP file, or just check the box and we'll reach out. We'll even take a thumb drive or a good old floppy disk 💾 — however it gets to us, we'll make it work.
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {[
                { id: "refGoogleBusiness", label: "Google Business Profile URL", type: "url", placeholder: "https://g.co/kgs/yourprofile" },
                { id: "refSop", label: "Standard Operating Procedures", sub: "Policies affecting how calls are handled", type: "file" },
                { id: "refScripts", label: "Existing Phone Scripts or Greetings", sub: "How your business phone is currently answered", type: "file_text" },
                { id: "refServices", label: "List of Services / Brochures", sub: "What you offer and how you describe it", type: "file" },
                { id: "refStaff", label: "Staff Directory — Key Personnel", sub: "Names of staff who may receive messages", type: "text" },
                { id: "refOther", label: "Other", sub: "Anything else that helps Ansera™ serve your callers", type: "file_text_desc" }
              ].map(ref => (
                <div key={ref.id} className={`flex flex-col gap-2 rounded border p-3 transition-all ${form.watch(ref.id as any) ? 'border-[#CFA911] bg-[#fffbea]' : 'border-[#e0ded8] bg-[#fafafa]'}`}>
                  <div className="flex items-start gap-2">
                    <Checkbox 
                      id={ref.id} 
                      onCheckedChange={(c) => form.setValue(ref.id as any, c === true)} 
                      checked={form.watch(ref.id as any)}
                      className="mt-0.5 data-[state=checked]:bg-[#C8102E] data-[state=checked]:border-[#C8102E]" 
                    />
                    <div className="flex-1">
                      <Label htmlFor={ref.id} className="text-[12px] font-bold text-[#333] cursor-pointer block leading-tight">{ref.label}</Label>
                      {ref.sub && <p className="text-[10px] text-gray-400 mt-0.5">{ref.sub}</p>}
                    </div>
                  </div>

                  {form.watch(ref.id as any) && (
                    <div className="mt-2 space-y-2">
                      {ref.type === "url" && (
                        <Input {...form.register(`${ref.id}Url` as any)} placeholder={ref.placeholder} className="h-7 text-xs bg-white" />
                      )}

                      {(ref.type === "file" || ref.type === "file_text" || ref.type === "file_text_desc") && (
                        <div className="space-y-1.5">
                          {ref.type === "file_text_desc" && (
                            <Input {...form.register("refOtherDesc")} placeholder="Describe what you're providing:" className="h-7 text-xs bg-white mb-1" />
                          )}
                          
                          <label 
                            htmlFor={`${ref.id}-file-input`}
                            className="block cursor-pointer rounded border-2 border-dashed border-gray-300 bg-white p-3 text-center text-[10px] text-gray-400 hover:bg-gray-50 transition-colors"
                            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                            onDrop={(e) => {
                              e.preventDefault(); e.stopPropagation();
                              const file = e.dataTransfer.files?.[0];
                              if (file) {
                                form.setValue(`${ref.id}File` as any, file.name);
                                toast.success(`Attached: ${file.name}`);
                              }
                            }}
                          >
                            ⇧ Upload or drag & drop
                            <input 
                              id={`${ref.id}-file-input`}
                              type="file" 
                              className="hidden" 
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  form.setValue(`${ref.id}File` as any, file.name);
                                  toast.success(`Attached: ${file.name}`);
                                }
                              }} 
                            />
                          </label>
                          {form.watch(`${ref.id}File` as any) && (
                            <div className="text-[10px] text-green-600 font-bold flex items-center gap-1.5 bg-green-50 p-1.5 rounded border border-green-100">
                              <span className="text-xs">📎</span> {form.watch(`${ref.id}File` as any)}
                            </div>
                          )}
                          <Input {...form.register(`${ref.id}Url` as any)} placeholder="Or paste a link" className="h-7 text-xs bg-white" />
                          
                          {(ref.type === "file_text" || ref.type === "file_text_desc") && (
                            <Textarea 
                              {...form.register(`${ref.id}Text` as any)} 
                              placeholder={ref.id === 'refScripts' ? "Or paste scripts here..." : "Or paste content here..."} 
                              className="min-h-[60px] text-xs bg-white py-2" 
                            />
                          )}
                        </div>
                      )}

                      {ref.type === "text" && (
                        <Textarea 
                          {...form.register(`${ref.id}Text` as any)} 
                          placeholder="List key staff names, one per line" 
                          className="min-h-[60px] text-xs bg-white py-2" 
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 bg-[#fffbea] border-l-4 border-[#CFA911] p-2.5 text-[10px] text-[#666] leading-relaxed flex items-center gap-2">
              <span className="text-sm">📋</span>
              <div>
                <strong>Upload limits:</strong> Max 50MB per file. ZIP files up to 100MB. For anything larger, paste a link or email us. Accepted: PDF, Word, Excel, PowerPoint, PNG, JPG, GIF, MP3, WAV, MP4, MOV, ZIP and more.
              </div>
            </div>

            <div className="mt-4">
              <TooltipLabel tooltip="Just the name for now — we'll follow up if we need access details.">Booking or Scheduling Calendar System</TooltipLabel>
              <Input {...form.register("bookingSystem")} placeholder="e.g. Google Calendar, GHL, Calendly, Jane App, Acuity, SimplyBook, Vagaro, Mindbody..." className="h-8 text-xs bg-white mt-1" />
            </div>
          </section>

          {/* Submit Section */}
          {!isReadOnly && (
            <section className="bg-[#333333] p-6 text-white rounded-md space-y-6">
              <div className="flex gap-3 items-start">
                <Checkbox id="auth" className="mt-1 border-white data-[state=checked]:bg-white data-[state=checked]:text-black" onCheckedChange={(c) => form.setValue("authorization", c === true)} />
                <Label htmlFor="auth" className="text-[10px] leading-relaxed text-gray-300">By submitting this form, I expressing interest in Ansera™ services offered by Otto Growth Labs. This is not a binding agreement.</Label>
              </div>
              <Button type="submit" className="w-full h-14 bg-[#C8102E] hover:bg-[#a00d25] font-bold text-lg tracking-wider">SUBMIT INTAKE FORM</Button>
              <div className="text-center text-[10px] text-gray-400">
                Call us: <span className="text-[#FFC72C] font-bold">559.801.1235</span><br/>
                <span className="text-[#FFC72C] font-bold uppercase tracking-wider">Dedicated Ansera™ Number: 775.429.7900</span>
              </div>
            </section>
          )}
        </form>

        <footer className="bg-[#222222] py-4 text-center text-[10px] text-gray-500 border-t border-gray-800">
          <p>www.OttoGrowthLabs.com | Hello@OttoGrowthLabs.com | 559.801.1235</p>
          <p className="mt-1 uppercase">© Otto Growth Labs. All Rights Reserved. | Ansera™ is a trademark of Otto Growth Labs.</p>
        </footer>
      </div>

      {showTopBtn && (
        <button onClick={scrollToTop} className="fixed bottom-6 right-6 bg-[#C8102E] text-white p-3 rounded-full shadow-lg hover:scale-110 transition-all">
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default Index;
