import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
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
        <TooltipTrigger type="button" className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#CFA911] text-[9px] font-bold text-white hover:bg-[#b5930e] transition-colors">?</TooltipTrigger>
        <TooltipContent><p className="text-xs max-w-[200px] font-normal normal-case">{tooltip}</p></TooltipContent>
      </Tooltip>
    )}
  </Label>
);

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [hasLatest, setHasLatest] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      advancedOptions: [],
      hipaaRegulated: "",
      discloseAi: "",
      minorsMayCall: "",
      callerNeedsAssistance: "",
      voiceGender: "",
      ringsBeforePickup: "",
      businessModel: "",
    }
  });

  useEffect(() => {
    setHasLatest(!!localStorage.getItem("ansera_snapshot_latest"));
  }, []);

  const saveForLater = () => {
    const data = form.getValues();
    const tempId = `draft_${crypto.randomUUID()}`;
    localStorage.setItem(`ansera_snapshot_${tempId}`, JSON.stringify(data));
    const resumeUrl = `${window.location.origin}${window.location.pathname}?snapshot=${tempId}`;
    navigator.clipboard.writeText(resumeUrl);
    toast.success("Progress saved! Resume link copied to clipboard.");
  };

  const quickFill = () => {
    const latest = localStorage.getItem("ansera_snapshot_latest");
    if (latest) {
      form.reset(JSON.parse(latest));
      toast.success("Loaded your last submission data!");
    } else {
      toast.error("No previous submission found on this device.");
    }
  };

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
        "contact.message_delivery_email": data.deliveryEmailEnabled ? data.deliveryEmail || "Yes" : "No",
        "contact.message_delivery_text": data.deliveryTextEnabled ? data.deliveryText || "Yes" : "No",
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
    navigate("/thank-you", { state: { snapshotUrl: submissionUrl, snapshotData: data } });
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

      // Auto-fill removed to ensure the form starts completely blank
      // Users can still use the "Quick-Fill" button if they want to restore their data
    } catch (e) {}
  }, [form, location.search, location.state]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      try { localStorage.setItem("ansera_form_data_v4", JSON.stringify(value)); } catch (e) {}
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const inputClasses = "flex h-8 w-full border border-[#ccc] bg-white px-2.5 py-2 text-[11px] text-[#333] outline-none focus:bg-[#fff5f7] focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E] transition-colors rounded-[3px]";

  return (
    <div className="min-h-screen bg-[#D9D9D9] py-6 px-3 font-sans text-sm">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[6px] border border-[#b8b8b2] bg-[#D9D9D9] shadow-2xl">
        {/* Header */}
        <header className="flex items-center justify-between border-b-4 border-[#C8102E] px-8 py-3 bg-white">
          <div className="flex items-center gap-4">
           <img src="/otto-growth-logo.jpg" alt="Otto Growth Labs" className="h-16 object-contain" />
            <div className="flex flex-col justify-center">
              <h1 className="text-sm font-bold tracking-wider text-gray-900 leading-tight">OTTO GROWTH LABS</h1>
              <p className="text-xs text-[#C8102E] font-semibold leading-tight">Ansera™ AI Phone Agent</p>
            </div>
          </div>
          <div className="text-right flex flex-col justify-center items-end">
            <div className="flex gap-2 mb-2 print:hidden">
              {!isReadOnly && (
                <Button type="button" variant="outline" size="sm" className="h-7 text-[10px] uppercase tracking-wider border-[#CFA911] text-[#CFA911] hover:bg-[#CFA911] hover:text-white" onClick={saveForLater}>
                  Save Progress
                </Button>
              )}
              <Button type="button" variant="outline" size="sm" className="h-7 text-[10px] uppercase tracking-wider" onClick={() => window.print()}>
                Print Form
              </Button>
            </div>
            <p className="text-lg font-bold text-[#C8102E] leading-tight">775.429.7900</p>
            <p className="text-xs text-gray-600 leading-tight mt-1 font-medium">Hello@OttoGrowthLabs.com</p>
          </div>
        </header>

        <div className="bg-[#333333] px-8 py-2.5 text-center text-white border-b border-[#222]">
          <h2 className="text-xl font-bold tracking-widest text-[#FFC72C] mb-0.5">ANSERA™ CLIENT INTAKE FORM</h2>
          <p className="text-xs text-gray-300 font-medium">Please complete all required fields. Your information helps us prepare the right solution for your business.</p>
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

       <form onSubmit={form.handleSubmit(onSubmit)} className={`px-8 py-5 space-y-5 bg-[#D9D9D9] ${isReadOnly ? '[&_input]:pointer-events-none [&_textarea]:pointer-events-none [&_select]:pointer-events-none [&_button]:pointer-events-none [&_label]:pointer-events-none opacity-95' : ''}`}>
          
          {hasLatest && !isReadOnly && (
            <div className="bg-[#f8f9fa] border border-[#e9ecef] p-3 flex items-center justify-between rounded">
              <span className="text-[11px] text-[#6c757d] font-bold uppercase tracking-wider">Returning client?</span>
              <button type="button" onClick={quickFill} className="text-[#C8102E] text-[11px] font-bold uppercase tracking-wider hover:underline">
                Load Last Submission (Quick-Fill)
              </button>
            </div>
          )}

          {/* Section 1 */}
          <section>
            <div className="mb-2 flex items-center gap-2 bg-[#333333] px-3 py-1.5 text-white rounded-sm">
              <span className="flex h-5 w-5 items-center justify-center bg-[#C8102E] text-xs font-bold rounded-[2px]">1</span>
              <h3 className="text-sm font-bold tracking-widest uppercase">Contact & Business Information</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-2">
              <div className="space-y-1">
                <TooltipLabel tooltip="The exact legal or DBA name callers know you by.">* COMPANY NAME</TooltipLabel>
                <Input {...form.register("companyName")} placeholder="As callers know it" className={inputClasses} />
                {form.formState.errors.companyName && <p className="text-red-500 text-[10px]">{form.formState.errors.companyName.message}</p>}
              </div>
              <div className="space-y-1">
                <TooltipLabel tooltip="The primary point of contact for this account.">* CONTACT NAME</TooltipLabel>
                <Input {...form.register("contactName")} placeholder="Your full name" className={inputClasses} />
                {form.formState.errors.contactName && <p className="text-red-500 text-[10px]">{form.formState.errors.contactName.message}</p>}
              </div>
              <div className="space-y-1">
                <TooltipLabel tooltip="Where we should send your proposal.">* EMAIL ADDRESS</TooltipLabel>
                <Input {...form.register("email")} type="email" placeholder="your@email.com" className={inputClasses} />
                {form.formState.errors.email && <p className="text-red-500 text-[10px]">{form.formState.errors.email.message}</p>}
              </div>
              <div className="space-y-1">
                <TooltipLabel tooltip="Used strictly for order updates.">SECONDARY EMAIL ADDRESS</TooltipLabel>
                <Input {...form.register("secondaryEmail")} type="email" placeholder="updates@yourbusiness.com" className={inputClasses} />
              </div>
              <div className="space-y-1">
                <TooltipLabel tooltip="Main business number.">* PRIMARY PHONE</TooltipLabel>
                <Input {...form.register("primaryPhone")} placeholder="Primary phone number" className={inputClasses} />
                {form.formState.errors.primaryPhone && <p className="text-red-500 text-[10px]">{form.formState.errors.primaryPhone.message}</p>}
              </div>
              <div className="space-y-1">
                <TooltipLabel tooltip="Alternate number.">SECONDARY PHONE</TooltipLabel>
                <Input {...form.register("secondaryPhone")} placeholder="Secondary phone number" className={inputClasses} />
              </div>
              <div className="space-y-1">
                <TooltipLabel tooltip="Core industry.">PRIMARY BUSINESS TYPE</TooltipLabel>
                <Input {...form.register("primaryBusinessType")} placeholder="e.g. Dental Office" className={inputClasses} />
              </div>
              <div className="space-y-1">
                <TooltipLabel tooltip="Main website URL.">WEBSITE URL</TooltipLabel>
                <Input {...form.register("websiteUrl")} type="url" placeholder="https://www.yourbusiness.com" className={inputClasses} />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.07em] text-[#555]">
                  Social Media Profiles <span className="text-[9px] text-[#aaa] normal-case tracking-normal font-normal">(fill in what applies)</span>
                </div>
                <div className="space-y-1">
                  {[
             { id: "socialFacebook", icon: "/facebook.svg", placeholder: "Facebook URL" },
{ id: "socialInstagram", icon: "/instagram.svg", placeholder: "Instagram URL" },
{ id: "socialYoutube", icon: "/youtube.svg", placeholder: "YouTube URL" },
{ id: "socialLinkedin", icon: "/linkedin.svg", placeholder: "LinkedIn URL" },
{ id: "socialOther1", icon: "/link.svg", placeholder: "Other URL" },
{ id: "socialOther2", icon: "/link.svg", placeholder: "Other URL" }
                  ].map(s => (
                    <div key={s.id} className="flex items-center gap-2 rounded-[3px] border border-[#ddd] bg-[#fafafa] px-2 py-1 focus-within:bg-[#fff5f7] focus-within:border-[#C8102E] transition-colors">
                      <img src={s.icon} className="h-3.5 w-3.5 shrink-0" alt="" />
                      <input type="url" {...form.register(s.id as any)} placeholder={s.placeholder} className="w-full bg-transparent text-[11px] outline-none text-[#333]" />
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.07em] text-[#555]">Hours of Operation</div>
                <div className="border border-[#E0DED8] rounded-[3px] overflow-hidden bg-white">
                  <div className="grid grid-cols-[64px_1fr_1fr_48px] gap-1 px-2 py-1 bg-[#f0efed] border-b border-[#E0DED8] text-[9px] font-bold text-[#777] uppercase tracking-wider">
                    <div>Day</div><div>Opens</div><div>Closes</div><div className="text-center">Closed</div>
                  </div>
                  {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, i) => (
                    <div key={day} className={`grid grid-cols-[64px_1fr_1fr_48px] items-center gap-1 px-2 py-1 ${i !== 6 ? 'border-b border-[#f0efed]' : ''}`}>
                      <div className="font-semibold text-[10px] text-[#444]">{day}</div>
                      <select className="rounded-[2px] border border-[#ddd] bg-white px-1 py-0.5 text-[9px] text-[#333] outline-none focus:border-[#C8102E] w-full">
                        <option>--</option><option>8:00 AM</option><option>9:00 AM</option>
                      </select>
                      <select className="rounded-[2px] border border-[#ddd] bg-white px-1 py-0.5 text-[9px] text-[#333] outline-none focus:border-[#C8102E] w-full">
                        <option>--</option><option>5:00 PM</option><option>6:00 PM</option>
                      </select>
                      <label className="flex cursor-pointer items-center justify-center gap-1 text-[9px] text-[#999] hover:text-[#555]">
                        <input type="checkbox" className="h-[10px] w-[10px] accent-[#C8102E] cursor-pointer" />
                        Closed
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              {[
                { id: 'hipaaRegulated', label: 'HIPAA Regulated?' },
                { id: 'discloseAi', label: 'Disclose AI to Callers?' },
                { id: 'minorsMayCall', label: 'Minors May Call?' }
              ].map((f) => (
                <div key={f.id} className="rounded-[3px] border border-[#e8e6e0] bg-[#fafafa] p-2">
                  <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.06em] text-[#555]">{f.label}</div>
                  <RadioGroup 
                    value={form.watch(f.id as any)} 
                    onValueChange={(val) => form.setValue(f.id as any, val)}
                    className="flex items-center gap-4"
                  >
                    <div className="flex items-center space-x-1.5">
                      <RadioGroupItem value="Yes" id={`${f.id}-yes`} className="w-3.5 h-3.5 text-[#C8102E] border-gray-300" />
                      <Label htmlFor={`${f.id}-yes`} className="text-[11px] text-[#444] cursor-pointer font-normal">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <RadioGroupItem value="No" id={`${f.id}-no`} className="w-3.5 h-3.5 text-[#C8102E] border-gray-300" />
                      <Label htmlFor={`${f.id}-no`} className="text-[11px] text-[#444] cursor-pointer font-normal">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              ))}
            </div>
            
            {form.watch("hipaaRegulated") === "Yes" && (
              <div className="mt-2 p-2 bg-[#fff5f7] border border-red-200 rounded-[3px] text-[10px] text-[#666] leading-relaxed">
                ⚕️ AI disclosure to callers is mandatory for HIPAA-regulated businesses and cannot be waived.
              </div>
            )}
          </section>

          {/* Section 2 */}
          <section>
            <div className="mb-2 flex items-center gap-2 bg-[#333333] px-3 py-1.5 text-white rounded-sm">
              <span className="flex h-5 w-5 items-center justify-center bg-[#C8102E] text-xs font-bold rounded-[2px]">2</span>
              <h3 className="text-sm font-bold tracking-widest uppercase">Call Flow & Priority Situations</h3>
            </div>
            <div className="mb-3 border-l-4 border-[#CFA911] bg-[#F1F0EC] px-3 py-2 text-xs text-gray-700">
  Your answers train Ansera™ to handle your business. Go ahead and type as much as you’d like — it will hold it. The more detail, the better.
</div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-2">
              {[
               { id: "topReasons", label: "1. TOP REASONS PEOPLE CALL", placeholder: "e.g. Scheduling, pricing, service area..." },
{ id: "questionsAskedMost", label: "2. QUESTIONS CALLERS ASK MOST", placeholder: "e.g. ‘Do you service my area?’ ‘What are your hours?’" },
{ id: "callsCannotMiss", label: "3. CALLS THAT CANNOT BE MISSED", placeholder: "e.g. Emergency calls, new client inquiries..." },
{ id: "situationsStress", label: "4. SITUATIONS THAT STRESS STAFF", placeholder: "e.g. Upset callers, not knowing answers..." },
{ id: "callsNeverAlone", label: "5. CALLS NEVER TO HANDLE ALONE", placeholder: "e.g. Complaints, legal matters, emergencies..." },
{ id: "commonFrustrations", label: "6. COMMON CALLER FRUSTRATIONS", placeholder: "e.g. Response times, pricing concerns..." },
              ].map((q) => (
                <div key={q.id} className="space-y-1">
                  <TooltipLabel>{q.label}</TooltipLabel>
                  <Textarea placeholder={q.placeholder} {...form.register(q.id as any)} className="min-h-[50px] resize-y text-xs bg-gray-50 focus:bg-[#fff5f7] focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E] transition-colors rounded-[3px]" />
                </div>
              ))}
            </div>
           <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <TooltipLabel>RINGS BEFORE PICKUP</TooltipLabel>
                <Select value={form.watch("ringsBeforePickup")} onValueChange={(val) => form.setValue("ringsBeforePickup", val)}>
                  <SelectTrigger className={inputClasses}>
                    <SelectValue placeholder="-- Choose --" />
                  </SelectTrigger>
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
              <div className="space-y-1">
                <TooltipLabel>BUSINESS MODEL</TooltipLabel>
                <Select value={form.watch("businessModel")} onValueChange={(val) => form.setValue("businessModel", val)}>
                  <SelectTrigger className={inputClasses}>
                    <SelectValue placeholder="-- Choose --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Customers come to us">Customers come to us</SelectItem>
                    <SelectItem value="Virtual / Online Business">Virtual / Online Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
          <div className="space-y-1">
  <TooltipLabel>URGENT CALLS ALWAYS SAME PERSON?</TooltipLabel>
  <div className="flex items-center gap-4 pt-2">
    <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
      <Checkbox
        checked={form.watch("urgentCallsSamePerson") === "yes"}
        onCheckedChange={(checked) => {
          if (checked) form.setValue("urgentCallsSamePerson", "yes");
        }}
      />
      YES
    </label>
    <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
      <Checkbox
        checked={form.watch("urgentCallsSamePerson") === "no"}
        onCheckedChange={(checked) => {
          if (checked) form.setValue("urgentCallsSamePerson", "no");
        }}
      />
      NO
    </label>
  </div>
</div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <div className="mb-2 flex items-center gap-2 bg-[#333333] px-3 py-1.5 text-white rounded-sm">
              <span className="flex h-5 w-5 items-center justify-center bg-[#C8102E] text-xs font-bold rounded-[2px]">3</span>
              <h3 className="text-sm font-bold tracking-widest uppercase">Select Your Ansera™ Plan</h3>
            </div>
            
            <div className="mb-3 border-l-4 border-[#CFA911] bg-[#F1F0EC] px-3 py-2 text-xs text-gray-700">
  Review what each plan includes. Many clients upgrade right here — and that’s perfectly fine. Your selections will be reflected in your formal pricing proposal.
</div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 items-start">
              
              {/* Assist+ Card */}
              <div className={`border-[2px] rounded-[6px] overflow-hidden transition-all ${form.watch("selectedPlan") === "assist" ? "border-[#C8102E] shadow-md" : "border-[#e0ded8]"}`}>
                <div className="bg-gradient-to-br from-[#6B6B6B] to-[#3A3A3A] px-3 py-2 flex items-center justify-between">
                  <div className="text-[16px] font-bold text-white tracking-[0.03em]">ASSIST+</div>
                  <div className="text-[8px] font-bold tracking-[0.07em] px-2 py-0.5 rounded-[20px] bg-white/20 text-white">STANDARD</div>
                </div>
                <div className="p-3 bg-white">
                 <div className="text-[12px] text-[#666] mb-3 italic leading-[1.5]">Included with your Assist+ plan:</div>
                  <div className="space-y-1 mb-3">
                    {["Available to answer inbound calls 24/7", "Personalized greeting using your business name", "Takes messages", "Collects caller name & phone number", "Confirms information back to caller", "Answers basic FAQs", "Provides business hours & location", "Shares current promotions & offers", "Message delivery via email and/or text"].map((f, i) => (
                      <div key={i} className="flex items-start gap-1.5 py-1 text-[10px] text-[#555] border-b border-[#f5f3ef] leading-[1.4]">
                       <span className="text-[#C8102E] text-[14px] font-bold shrink-0">✓</span><span className="text-[13px] font-medium text-[#333]">{f}</span>
                      </div>
                    ))}
                  </div>
                  <Button type="button" variant="outline" onClick={() => form.setValue("selectedPlan", "assist")} className={`w-full h-8 text-[10px] font-bold tracking-[0.06em] uppercase rounded-[3px] transition-colors border-[#C8102E] ${form.watch("selectedPlan") === "assist" ? "bg-[#C8102E] text-white hover:bg-[#a00d25] hover:text-white" : "bg-white text-[#C8102E] hover:bg-[#C8102E] hover:text-white"}`}>
                    SELECT ASSIST+
                  </Button>
                </div>
              </div>

              {/* Elite Card */}
              <div className={`border-[2px] rounded-[6px] overflow-hidden transition-all ${form.watch("selectedPlan") === "elite" ? "border-[#C8102E] shadow-md" : "border-[#e0ded8]"}`}>
                <div className="bg-gradient-to-br from-[#C8102E] to-[#8A0E1F] px-3 py-2 flex items-center justify-between">
                  <div className="text-[16px] font-bold text-white tracking-[0.03em]">ELITE</div>
                  <div className="text-[8px] font-bold tracking-[0.07em] px-2 py-0.5 rounded-[20px] bg-white text-[#C8102E]">MOST POPULAR</div>
                </div>
                <div className="p-3 bg-white">
                  <div className="text-[12px] text-[#666] mb-3 italic leading-[1.5]">Ansera™ Elite includes all Assist+ features, and adds:</div>
                  <div className="space-y-1 mb-3">
                    {["Advanced FAQs", "Set an appointment", "Schedule estimate appointments", "Schedule & callback scheduling", "Booking confirmation texts to caller", "Appointment reminder texts to caller", "Directions, location details & helpful links via text/email", "Can provide current business promotions and offers", "Message delivery via email AND text", "Urgent call forwarding — one person, immediately at end of call", "Post-call SMS notifications", "Language detection — responds in caller's language", "Payment or purchase links via text and/or email"].map((f, i) => (
                      <div key={i} className="flex items-start gap-1.5 py-1 text-[10px] text-[#555] border-b border-[#f5f3ef] leading-[1.4]">
                      <span className="text-[#C8102E] text-[14px] font-bold shrink-0">✓</span><span className="text-[13px] font-medium text-[#333]">{f}</span>
                      </div>
                    ))}
                  </div>
                  <Button type="button" variant="outline" onClick={() => { form.setValue("selectedPlan", "elite"); form.setValue("advancedOptions", []); }} className={`w-full h-8 text-[10px] font-bold tracking-[0.06em] uppercase rounded-[3px] transition-colors border-[#C8102E] ${form.watch("selectedPlan") === "elite" ? "bg-[#C8102E] text-white hover:bg-[#a00d25] hover:text-white" : "bg-white text-[#C8102E] hover:bg-[#C8102E] hover:text-white"}`}>
                    SELECT ELITE
                  </Button>
                </div>
              </div>

              {/* Advanced Card */}
              <div className={`border-[2px] rounded-[6px] overflow-hidden transition-all ${form.watch("selectedPlan") === "advanced" ? "border-[#CFA911] shadow-md" : "border-[#e0ded8]"}`}>
                <div className="bg-gradient-to-br from-[#CFA911] to-[#8A6E00] px-3 py-2 flex items-center justify-between">
                  <div className="text-[16px] font-bold text-white tracking-[0.03em]">ADVANCED</div>
                  <div className="text-[8px] font-bold tracking-[0.07em] px-2 py-0.5 rounded-[20px] bg-white/25 text-white">YOUR BUILD</div>
                </div>
                <div className="p-3 bg-white">
                  <div className="text-[12px] text-[#666] mb-3 italic leading-[1.5]">Everything in Elite, plus what you choose below:</div>
                 <div className="text-[11px] font-bold text-[#C8102E] tracking-[0.12em] mb-3 uppercase">CHECK ALL YOU'D LIKE TO EXPLORE:</div>
                  
                  <div className="space-y-0 mb-2">
                    {[
                      { id: "Appointment rescheduling", desc: "" },
                      { id: "Multi-location call routing", desc: "Direct callers to the right office or location" },
                      { id: "Service area qualification", desc: "Confirm if caller is within your service area" },
                      { id: "New vs. existing caller sorting", desc: "Each welcomed in the way that best serves them" },
                      { id: "Forms or documents via text and/or email", desc: "New client forms, waivers, info packets" },
                      { id: "Multilingual support", desc: "Additional language configuration and routing" }
                    ].map((opt, i) => (
                     <label key={i} className="flex items-start gap-3 rounded-[3px] border border-gray-100 bg-[#fafafa] px-2.5 py-2 cursor-pointer hover:border-[#CFA911] hover:bg-[#fffaf0] transition-colors">
                        <Checkbox 
                         className="mt-0.5 h-4 w-4 border-gray-300 text-[#C8102E] focus:ring-[#C8102E]"
                          checked={form.watch("advancedOptions")?.includes(opt.id)}
                          onCheckedChange={(checked) => {
                            const current = form.getValues("advancedOptions") || [];
                            form.setValue("advancedOptions", checked ? [...current, opt.id] : current.filter(v => v !== opt.id));
                            if (checked) form.setValue("selectedPlan", "advanced");
                          }}
                        />
                        <div className="leading-[1.2]">
                          <div className="text-[12px] font-medium text-[#333] leading-snug">{opt.id}</div>
                         {opt.desc && <div className="text-[10px] text-[#888] mt-0.5 leading-snug">{opt.desc}</div>}
                        </div>
                      </label>
                    ))}
                  </div>
                  
               <div className="rounded-[3px] border border-[#f3c4c9] bg-[#fff5f6] px-3 py-2 text-[11px] leading-[1.45] text-[#555] mb-2">
  Some selections may require a few extra details. We’ll follow up only if needed.
</div>

                  <Button type="button" variant="outline" onClick={() => form.setValue("selectedPlan", "advanced")} className={`w-full h-8 text-[10px] font-bold tracking-[0.06em] uppercase rounded-[3px] transition-colors border-[#C8102E] ${form.watch("selectedPlan") === "advanced" ? "bg-[#C8102E] text-white hover:bg-[#a00d25] hover:text-white" : "bg-white text-[#C8102E] hover:bg-[#C8102E] hover:text-white"}`}>
                    SELECT ADVANCED
                  </Button>
                </div>
              </div>

            </div>
          </section>

          {/* Section 4 & 5 Combined Layout */}
          <section>
            <div className="mb-2 flex items-center gap-2 bg-[#333333] px-3 py-1.5 text-white rounded-sm">
              <span className="flex h-5 w-5 items-center justify-center bg-[#C8102E] text-xs font-bold rounded-[2px]">4</span>
             <h3 className="text-sm font-bold tracking-widest uppercase">Voice Preferences</h3>
            </div>
            
            <div className="w-full">
             <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-3">
                <div className="space-y-1 w-full min-w-0">
                  <TooltipLabel>VOICE GENDER</TooltipLabel>
                  <Select value={form.watch("voiceGender")} onValueChange={(val) => form.setValue("voiceGender", val)}>
                   <SelectTrigger className={`${inputClasses} w-full`}>
                      <SelectValue placeholder="-- Choose --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Male">Male</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1 w-full min-w-0">
                  <TooltipLabel tooltip="Give your AI agent a name.">VOICE PERSONA NAME (OPTIONAL)</TooltipLabel>
                  <Input {...form.register("voicePersonaName")} placeholder="e.g. Alex, Jordan, Sarah..." className={`${inputClasses} w-full`} />
                </div>
                <div className="space-y-1 w-full min-w-0">
                  <TooltipLabel>LANGUAGES NEEDED</TooltipLabel>
                 <Input {...form.register("languagesNeeded")} placeholder="e.g. English, Spanish, Armenian..." className={`${inputClasses} w-full`} />
                </div>

<div className="space-y-1 md:col-span-3">
  <TooltipLabel>LANGUAGE OPTIONS</TooltipLabel>
  <label className="flex w-full items-center gap-2 rounded-[3px] border border-gray-200 bg-white px-3 py-2 text-[13px] text-[#333] cursor-pointer">
    <Checkbox {...form.register("autoDetectLanguage")} className="border-gray-300 text-[#C8102E]" />
    <span>Auto-detect caller language & respond accordingly</span>
    <span className="font-semibold text-[#CFA911]">(Elite)</span>
  </label>
                </div>
              </div>
  </div>
</section>

{/* Section 5 */}
<section>
  <div className="mb-2 flex items-center gap-2 bg-[#333333] px-3 py-1.5 text-white rounded-sm">
    <span className="flex h-5 w-5 items-center justify-center bg-[#C8102E] text-xs font-bold rounded-[2px]">5</span>
    <h3 className="text-sm font-bold tracking-widest uppercase">Message Delivery Preferences</h3>
  </div>

  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
    <div className="space-y-2">
      <TooltipLabel>MESSAGE DELIVERY PREFERENCE</TooltipLabel>

      <div className="space-y-2">
        <div className="flex items-center gap-2 rounded-[3px] border border-gray-200 bg-[#fafafa] px-3 py-2">
          <Checkbox {...form.register("deliveryEmailEnabled")} className="border-gray-300 text-[#C8102E]" />
          <span className="w-[70px] text-[12px] text-[#333]">Email</span>
          <Input type="email" {...form.register("deliveryEmail")} placeholder="Email address" className={`${inputClasses} flex-1`} />
        </div>

        <div className="flex items-center gap-2 rounded-[3px] border border-gray-200 bg-[#fafafa] px-3 py-2">
          <Checkbox {...form.register("deliveryTextEnabled")} className="border-gray-300 text-[#C8102E]" />
          <span className="w-[70px] text-[12px] text-[#333]">Text / SMS</span>
          <Input type="text" {...form.register("deliveryText")} placeholder="Phone number" className={`${inputClasses} flex-1`} />
        </div>

        <div className="flex items-center gap-2 rounded-[3px] border border-gray-200 bg-[#fafafa] px-3 py-2">
          <Checkbox {...form.register("deliveryOtherEnabled")} className="border-gray-300 text-[#C8102E]" />
          <span className="w-[70px] text-[12px] text-[#333]">Other</span>
          <Input type="text" {...form.register("deliveryOther")} placeholder="Describe setup..." className={`${inputClasses} flex-1`} />
        </div>
      </div>
    </div>

    <div className="space-y-2">
      <TooltipLabel>WHEN A CALLER NEEDS ASSISTANCE, ANSERA™ SHOULD:</TooltipLabel>

      <RadioGroup value={form.watch("callerNeedsAssistance")} onValueChange={(val) => form.setValue("callerNeedsAssistance", val)}>
        <div className="space-y-2">
          {[
            "Always take a message AND offer to forward the call",
            "Only forward the call if the caller specifically requests it",
            "Take a message only — calls will not be forwarded"
          ].map((opt) => (
            <div key={opt} className="flex items-center gap-2 rounded-[3px] border border-gray-200 bg-[#fafafa] px-3 py-2">
              <RadioGroupItem value={opt} id={`assist-${opt}`} className="w-3.5 h-3.5 text-[#C8102E] border-gray-300" />
              <Label htmlFor={`assist-${opt}`} className="text-[12px] text-[#333] cursor-pointer font-normal">{opt}</Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  </div>
</section>

{/* Section 6 */}
          <section>
            <div className="mb-2 flex items-center gap-2 bg-[#333333] px-3 py-1.5 text-white rounded-sm">
              <span className="flex h-5 w-5 items-center justify-center bg-[#C8102E] text-xs font-bold rounded-[2px]">6</span>
              <h3 className="text-sm font-bold tracking-widest uppercase">Reference Materials</h3>
            </div>
            
            <p className="text-[10px] text-[#888] italic mb-2 px-1">
              All items in this section are optional. Share what you have today — more can always be added later.
            </p>

            <div className="bg-[#F1F0EC] border-l-[4px] border-[#CFA911] p-2.5 text-[11px] text-[#555] leading-[1.5] mb-3">
              <strong>The more you share, the smarter Ansera™ becomes.</strong> Upload whatever applies. Can't upload? Paste a link, upload a ZIP file, or just check the box and we'll reach out. We'll even take a thumb drive or a good old floppy disk 💾 — however it gets to us, we'll make it work.
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {[
                { id: "refGoogleBusiness", label: "Google Business Profile URL", type: "url", placeholder: "https://g.co/kgs/yourprofile" },
                { id: "refSop", label: "Standard Operating Procedures", sub: "Policies affecting how calls are handled", type: "file" },
                { id: "refScripts", label: "Existing Phone Scripts or Greetings", sub: "How your business phone is currently answered", type: "file_text" },
                { id: "refServices", label: "List of Services / Brochures", sub: "What you offer and how you describe it", type: "file" },
                { id: "refStaff", label: "Staff Directory — Key Personnel", sub: "Names of staff who may receive messages", type: "text" },
                { id: "refOther", label: "Other", sub: "Anything else that helps Ansera™ serve your callers", type: "file_text_desc" }
              ].map(ref => (
                <div key={ref.id} className={`flex flex-col gap-2 rounded-[4px] border p-2.5 transition-all ${form.watch(ref.id as any) ? 'border-[#CFA911] bg-[#fffbea]' : 'border-[#e0ded8] bg-[#fafafa]'}`}>
                  <div className="flex items-start gap-2">
                    <Checkbox 
                      id={ref.id} 
                      checked={form.watch(ref.id as any) || false}
                      onCheckedChange={(checked) => form.setValue(ref.id as any, checked === true)}
                      className="mt-0.5 border-gray-300 text-[#C8102E] focus:ring-[#C8102E] shrink-0" 
                    />
                    <div className="flex-1">
                      <Label htmlFor={ref.id} className="text-[11px] font-bold text-[#333] cursor-pointer block leading-tight">{ref.label}</Label>
                      {ref.sub && <p className="text-[9px] text-[#888] mt-0.5 leading-tight">{ref.sub}</p>}
                    </div>
                  </div>

                  {form.watch(ref.id as any) && (
                    <div className="mt-2 space-y-2">
                      {ref.type === "url" && (
                        <Input type="url" {...form.register(`${ref.id}Url` as any)} placeholder={ref.placeholder} className={inputClasses} />
                      )}

                      {(ref.type === "file" || ref.type === "file_text" || ref.type === "file_text_desc") && (
                        <div className="space-y-2">
                          {ref.type === "file_text_desc" && (
                            <Input type="text" {...form.register("refOtherDesc")} placeholder="Describe what you're providing:" className={inputClasses} />
                          )}
                          
                          <label 
                            className="block cursor-pointer rounded-[3px] border-[1.5px] border-dashed border-[#ddd] bg-white p-2 text-center text-[10px] text-[#aaa] hover:bg-gray-50 transition-colors"
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
                            <span className="text-[12px]">⇧</span> Upload or drag & drop
                            <input 
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
                            <div className="text-[10px] text-green-700 font-bold flex items-center gap-1.5 bg-green-50 p-1.5 rounded border border-green-200">
                              <span className="text-[12px]">📎</span> {form.watch(`${ref.id}File` as any)}
                            </div>
                          )}
                          <Input type="url" {...form.register(`${ref.id}Url` as any)} placeholder="Or paste a link" className={inputClasses} />
                          
                          {(ref.type === "file_text" || ref.type === "file_text_desc") && (
                            <Textarea 
                              {...form.register(`${ref.id}Text` as any)} 
                              placeholder={ref.id === 'refScripts' ? "Or paste scripts here..." : "Or paste content here..."} 
                              className={`${inputClasses} min-h-[50px] resize-y`} 
                            />
                          )}
                        </div>
                      )}

                      {ref.type === "text" && (
                        <Textarea 
                          {...form.register(`${ref.id}Text` as any)} 
                          placeholder="List key staff names, one per line" 
                          className={`${inputClasses} min-h-[60px] resize-y`} 
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-3 bg-[#fffbea] border-l-[3px] border-[#CFA911] p-2 text-[9px] text-[#666] leading-[1.6] flex items-start gap-1.5">
              <span className="text-[12px]">📋</span>
              <div>
                <strong>Upload limits:</strong> Max 50MB per file. ZIP files up to 100MB. For anything larger, paste a link or email us. Accepted: PDF, Word, Excel, PowerPoint, PNG, JPG, GIF, MP3, WAV, MP4, MOV, ZIP and more.
              </div>
            </div>

            <div className="mt-4 space-y-1">
              <TooltipLabel tooltip="Just the name for now — we'll follow up if we need access details.">Booking or Scheduling Calendar System</TooltipLabel>
              <Input type="text" {...form.register("bookingSystem")} placeholder="e.g. Google Calendar, GHL, Calendly, Jane App, Acuity, SimplyBook, Vagaro, Mindbody..." className={inputClasses} />
            </div>
            
           </section>

{/* Section 7 */}
<section>
  <div className="mb-2 flex items-center gap-2 bg-[#333333] px-3 py-1.5 text-white rounded-sm">
    <span className="flex h-5 w-5 items-center justify-center bg-[#C8102E] text-xs font-bold rounded-[2px]">7</span>
    <h3 className="text-sm font-bold tracking-widest uppercase">Anything Else?</h3>
  </div>

  <div className="border border-dashed border-gray-300 bg-white p-3">
    <TooltipLabel>IS THERE ANYTHING UNIQUE ABOUT YOUR BUSINESS WE HAVEN'T ASKED ABOUT?</TooltipLabel>
    <Textarea
      {...form.register("anythingElse")}
      placeholder="Tell us anything — unique situations, special instructions, industry quirks..."
      className={`${inputClasses} min-h-[80px] resize-y`}
    />
  </div>
</section>

         {/* Authorization & Inquiry */}
<section>
  <div className="bg-[#2b2b2b] border-t-4 border-[#CFA911] p-5 shadow-md">
    <h3 className="text-sm font-bold tracking-widest uppercase text-gray-200 mb-3">
      Authorization & Inquiry
    </h3>

    <p className="text-[#FFC72C] italic text-[12px] mb-4">
      The more information you provide, the better we can evaluate your needs and build the right solution for your business.
    </p>

    <label className="flex gap-3 border border-gray-600 bg-[#333333] p-4 text-white cursor-pointer group">
      <Checkbox
        checked={form.watch("authorization") || false}
        onCheckedChange={(checked) => form.setValue("authorization", checked === true)}
        className="mt-0.5 border-gray-300 text-[#C8102E] focus:ring-[#C8102E] data-[state=checked]:bg-[#C8102E] data-[state=checked]:border-[#C8102E]"
      />
      <span className="text-[12px] leading-[1.6] text-gray-100 group-hover:text-white transition-colors">
        By submitting this form, I am expressing interest in Ansera™ services offered by Otto Growth Labs. The information I provide will be used to evaluate my business needs and prepare a customized service recommendation and formal pricing proposal. Submitting this form does not constitute a purchase, commitment, or binding agreement of any kind. A member of the Otto Growth Labs team will be in touch to review my selections, answer my questions, and present my options. I confirm that the information provided is accurate and that I have the right to submit it on behalf of my business.
      </span>
    </label>

    {form.formState.errors.authorization && (
      <p className="text-red-400 text-[10px] font-bold mt-2">
        {form.formState.errors.authorization.message}
      </p>
    )}
  </div>

  <div className="text-center py-5">
    <Button type="submit" className="w-full max-w-md h-12 bg-[#C8102E] hover:bg-[#aa0d25] font-bold text-[14px] tracking-[0.1em] text-white rounded-[4px] transition-colors shadow-lg">
      SUBMIT MY ANSERA™ INTAKE FORM
    </Button>

    <div className="mt-4 text-[12px] text-gray-600 space-y-1">
      <div>
        A member of the Otto Growth Labs team will be in touch to confirm your selections and next steps.
        <span className="ml-2">Call us: <span className="text-[#CFA911] font-bold">1.775.429.7900</span></span>
      </div>
      <div className="text-[#CFA911] font-bold">
        Ansera™ Direct Line: 1.775.429.7900
      </div>
    </div>
  </div>
</section>
        </form>

        <footer className="bg-[#222222] py-4 text-center text-[10px] text-gray-500 border-t border-[#111]">
          <p className="mb-1">www.OttoGrowthLabs.com | Hello@OttoGrowthLabs.com | 559.801.1235</p>
          <p className="uppercase tracking-wide text-[8px]">© Otto Growth Labs. All Rights Reserved. | Ansera™ is a trademark of Otto Growth Labs.</p>
        </footer>
      </div>

      {showTopBtn && (
        <button onClick={scrollToTop} className="fixed bottom-6 right-6 bg-[#C8102E] text-white p-3 rounded-full shadow-lg hover:scale-110 transition-all z-50 print:hidden">
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default Index;
