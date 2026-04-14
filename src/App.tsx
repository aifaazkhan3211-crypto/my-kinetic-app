import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Sparkles, 
  Type, 
  Palette, 
  Video, 
  Mic, 
  Send, 
  History, 
  Settings2, 
  Download,
  Loader2,
  ChevronRight,
  MessageSquare,
  Volume2,
  Zap,
  Check,
  Crown,
  Share2,
  Layers,
  Maximize2,
  Clock,
  Trash2,
  Plus,
  TrendingUp,
  DollarSign,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { 
  generateMotionPrompt, 
  generateVideo, 
  generateAudio, 
  chatWithDesigner,
  optimizeScript,
  decomposeScript
} from "@/services/gemini";

export default function App() {
  const [script, setScript] = useState("SUCCESS chahiye?\n\nToh suno...\n\nTalent important hai...\n\nBUT... consistency zyada powerful hai.");
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [highlightColor, setHighlightColor] = useState("#FACC15");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [scenes, setScenes] = useState<any[]>([]);
  const [isDecomposing, setIsDecomposing] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: string, text: string}[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [activeTab, setActiveTab] = useState("editor");
  const [isPro, setIsPro] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleOptimizeScript = async () => {
    if (!script.trim()) return;
    setIsOptimizing(true);
    try {
      const optimized = await optimizeScript(script);
      setScript(optimized);
      toast.success("Script optimized by AI Designer!");
    } catch (error) {
      toast.error("Failed to optimize script.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleGenerate = async () => {
    if (!script.trim()) {
      toast.error("Please enter a script first");
      return;
    }

    setIsGenerating(true);
    try {
      let currentScenes = scenes;
      if (scenes.length === 0) {
        toast.info("Decomposing script into scenes...");
        currentScenes = await decomposeScript(script);
        setScenes(currentScenes);
      }

      toast.info("Analyzing scenes and generating motion prompt...");
      const prompt = await generateMotionPrompt(currentScenes, { backgroundColor, textColor, highlightColor });
      
      toast.info("Generating high-impact video (this may take a few minutes)...");
      const video = await generateVideo(prompt);
      setVideoUrl(video);

      toast.info("Generating rhythmic voiceover...");
      const audio = await generateAudio(script);
      setAudioUrl(audio);

      toast.success("Motion graphic generated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate motion graphic. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDecompose = async () => {
    if (!script.trim()) return;
    setIsDecomposing(true);
    try {
      const result = await decomposeScript(script);
      setScenes(result);
      setActiveTab("editor"); // Switch to editor to see scenes
      toast.success("Script decomposed into editable scenes!");
    } catch (error) {
      toast.error("Failed to decompose script.");
    } finally {
      setIsDecomposing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const newMessage = { role: "user", text: currentMessage };
    setChatMessages(prev => [...prev, newMessage]);
    setCurrentMessage("");

    try {
      const response = await chatWithDesigner(currentMessage, chatMessages);
      setChatMessages(prev => [...prev, { role: "model", text: response || "I'm sorry, I couldn't process that." }]);
    } catch (error) {
      toast.error("Chat failed. Please try again.");
    }
  };

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      features: ["720p Video Generation", "Standard AI Designer", "3 Generations / Day", "Basic Templates"],
      current: !isPro,
      buttonText: "Current Plan"
    },
    {
      name: "Pro",
      price: "$19",
      features: ["4K Video Generation", "Advanced Script Doctor", "Unlimited Generations", "Custom Font Uploads", "Priority Rendering", "No Watermark"],
      current: isPro,
      buttonText: isPro ? "Current Plan" : "Upgrade to Pro",
      highlight: true
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-yellow-400 selection:text-black overflow-hidden">
      <Toaster position="top-center" theme="dark" richColors />
      
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-400/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="border-b border-white/5 p-4 flex items-center justify-between bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(250,204,21,0.3)]"
          >
            <Sparkles className="text-black w-6 h-6" />
          </motion.div>
          <div>
            <h1 className="text-xl font-black tracking-tighter leading-none">KINETIC<span className="text-yellow-400">SCRIPT</span></h1>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Motion Graphics Engine v2.0</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isPro ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">PRO MEMBER</span>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowPricing(true)}
              className="border-yellow-400/20 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all font-bold"
            >
              <Crown className="w-4 h-4 mr-2" />
              UPGRADE
            </Button>
          )}
          <Separator orientation="vertical" className="h-8 bg-white/10" />
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="bg-white text-black hover:bg-yellow-400 transition-all font-black px-8 h-10 shadow-lg"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2 fill-current" />
            )}
            GENERATE
          </Button>
        </div>
      </header>

      <main className="flex h-[calc(100vh-73px)] relative z-10">
        {/* Left Sidebar: Chat & Assets */}
        <aside className="w-80 border-r border-white/5 flex flex-col bg-black/20 backdrop-blur-sm">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-yellow-400" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-white/60">AI Assistant</h2>
            </div>
            {isPro && <div className="px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 text-[8px] font-black tracking-tighter border border-yellow-400/20">PRO</div>}
          </div>
          
          <ScrollArea className="flex-1 px-4 py-6">
            <div className="space-y-6">
              {chatMessages.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4"
                >
                  <p className="text-white/60 text-xs leading-relaxed italic">
                    "I can help you write viral scripts, choose the perfect color palette, or explain kinetic typography trends. What are we building today?"
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button onClick={() => setCurrentMessage("Give me a viral hook for consistency")} className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 px-2 py-1 rounded-full text-white/40 hover:text-white transition-colors">Viral Hook</button>
                    <button onClick={() => setCurrentMessage("Suggest a brutalist color palette")} className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 px-2 py-1 rounded-full text-white/40 hover:text-white transition-colors">Brutalist Palette</button>
                  </div>
                </motion.div>
              )}
              
              <AnimatePresence mode="popLayout">
                {chatMessages.map((msg, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.95, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[90%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-yellow-400 text-black font-medium rounded-tr-none' 
                        : 'bg-white/5 text-white/90 rounded-tl-none border border-white/10'
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={chatEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-white/5 bg-black/40">
            <div className="relative group">
              <Input 
                placeholder="Ask your designer..." 
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="bg-white/5 border-white/10 pr-10 focus:ring-yellow-400 h-11 rounded-xl transition-all group-hover:border-white/20"
              />
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={handleSendMessage}
                className="absolute right-1 top-1 h-9 w-9 text-yellow-400 hover:text-yellow-500 hover:bg-transparent"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </aside>

        {/* Center: Editor & Canvas Settings */}
        <section className="flex-1 flex flex-col overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between bg-black/20">
              <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl">
                <TabsTrigger value="editor" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:text-black font-bold text-xs uppercase tracking-widest">
                  <Type className="w-3.5 h-3.5 mr-2" />
                  Script
                </TabsTrigger>
                <TabsTrigger value="timeline" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:text-black font-bold text-xs uppercase tracking-widest">
                  <Clock className="w-3.5 h-3.5 mr-2" />
                  Timeline
                </TabsTrigger>
                <TabsTrigger value="style" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:text-black font-bold text-xs uppercase tracking-widest">
                  <Palette className="w-3.5 h-3.5 mr-2" />
                  Style
                </TabsTrigger>
                <TabsTrigger value="assets" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:text-black font-bold text-xs uppercase tracking-widest">
                  <Layers className="w-3.5 h-3.5 mr-2" />
                  Assets
                </TabsTrigger>
                <TabsTrigger value="growth" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:text-black font-bold text-xs uppercase tracking-widest">
                  <TrendingUp className="w-3.5 h-3.5 mr-2" />
                  Growth
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                  GPU Accelerated
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-8 max-w-4xl mx-auto">
                <TabsContent value="editor" className="mt-0 space-y-8">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400/20 to-blue-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-[#0A0A0A] border border-white/10 rounded-3xl p-6">
                      <Label className="text-white/40 uppercase tracking-[0.2em] text-[10px] font-black mb-4 block">Script Editor</Label>
                      <Textarea 
                        placeholder="Type your script here..."
                        value={script}
                        onChange={(e) => setScript(e.target.value)}
                        className="min-h-[350px] bg-transparent border-none text-3xl font-bold leading-[1.4] resize-none focus-visible:ring-0 p-0 placeholder:text-white/10 selection:bg-yellow-400 selection:text-black"
                      />
                      <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                        <div className="flex items-center gap-4">
                          <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                            {script.length} chars
                          </div>
                          <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                            {script.split(/\s+/).filter(Boolean).length} words
                          </div>
                        </div>
                        <Button 
                          onClick={handleOptimizeScript}
                          disabled={isOptimizing}
                          variant="secondary"
                          className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-6 h-9 text-xs font-bold"
                        >
                          {isOptimizing ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Sparkles className="w-3 h-3 mr-2 text-yellow-400" />}
                          OPTIMIZE WITH AI
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <Card 
                      onClick={handleDecompose}
                      className="bg-white/5 border-white/10 p-5 hover:bg-white/[0.08] transition-all cursor-pointer group rounded-2xl"
                    >
                      <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        {isDecomposing ? <Loader2 className="w-5 h-5 text-yellow-400 animate-spin" /> : <Clock className="w-5 h-5 text-yellow-400" />}
                      </div>
                      <h3 className="text-sm font-bold mb-1">Decompose Scenes</h3>
                      <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-wider">Break script into editable kinetic scenes for precise control.</p>
                    </Card>
                    <Card className="bg-white/5 border-white/10 p-5 hover:bg-white/[0.08] transition-all cursor-pointer group rounded-2xl">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Mic className="w-5 h-5 text-blue-400" />
                      </div>
                      <h3 className="text-sm font-bold mb-1">Voice-to-Script</h3>
                      <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-wider">Record audio and let AI transcribe it into a kinetic script.</p>
                    </Card>
                    <Card className="bg-white/5 border-white/10 p-5 hover:bg-white/[0.08] transition-all cursor-pointer group rounded-2xl">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Zap className="w-5 h-5 text-purple-400" />
                      </div>
                      <h3 className="text-sm font-bold mb-1">Quick Hooks</h3>
                      <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-wider">Generate 5 viral hook variations for your current topic.</p>
                    </Card>
                    <Card className="bg-white/5 border-white/10 p-5 hover:bg-white/[0.08] transition-all cursor-pointer group rounded-2xl">
                      <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <History className="w-5 h-5 text-yellow-400" />
                      </div>
                      <h3 className="text-sm font-bold mb-1">Version History</h3>
                      <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-wider">Restore previous versions of your script and style settings.</p>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="timeline" className="mt-0 space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-black tracking-tighter uppercase">Scene Timeline</h2>
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Edit individual kinetic moments</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setScenes([...scenes, { text: "New Scene", animation: "Fade In", duration: "3" }])}
                      className="border-white/10 hover:bg-white/5"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Scene
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {scenes.length === 0 ? (
                      <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                        <Clock className="w-12 h-12 text-white/10 mx-auto mb-4" />
                        <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">No scenes generated yet</h3>
                        <Button 
                          onClick={handleDecompose}
                          disabled={isDecomposing}
                          variant="link" 
                          className="text-yellow-400 mt-2"
                        >
                          Decompose script to start editing
                        </Button>
                      </div>
                    ) : (
                      scenes.map((scene, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
                        >
                          <div className="grid grid-cols-[1fr_200px_100px_40px] gap-6 items-start">
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Scene Text</Label>
                              <Input 
                                value={scene.text}
                                onChange={(e) => {
                                  const newScenes = [...scenes];
                                  newScenes[idx].text = e.target.value;
                                  setScenes(newScenes);
                                }}
                                className="bg-transparent border-none text-lg font-bold p-0 focus-visible:ring-0 h-auto"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Animation</Label>
                              <Select 
                                value={scene.animation}
                                onValueChange={(val) => {
                                  const newScenes = [...scenes];
                                  newScenes[idx].animation = val;
                                  setScenes(newScenes);
                                }}
                              >
                                <SelectTrigger className="bg-white/5 border-white/10 h-9 rounded-lg text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#111] border-white/10 text-white">
                                  <SelectItem value="Zoom-in punch">Zoom-in punch</SelectItem>
                                  <SelectItem value="Glitch slide">Glitch slide</SelectItem>
                                  <SelectItem value="Staggered reveal">Staggered reveal</SelectItem>
                                  <SelectItem value="Kinetic shake">Kinetic shake</SelectItem>
                                  <SelectItem value="Fade In">Fade In</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Duration</Label>
                              <div className="flex items-center gap-2">
                                <Input 
                                  type="number"
                                  value={scene.duration}
                                  onChange={(e) => {
                                    const newScenes = [...scenes];
                                    newScenes[idx].duration = e.target.value;
                                    setScenes(newScenes);
                                  }}
                                  className="bg-white/5 border-white/10 h-9 rounded-lg text-xs w-16"
                                />
                                <span className="text-[10px] font-bold text-white/20">s</span>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => setScenes(scenes.filter((_, i) => i !== idx))}
                              className="mt-6 text-white/20 hover:text-red-500 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-black text-[10px] font-black shadow-lg">
                            {idx + 1}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="style" className="mt-0 space-y-10">
                  <div className="grid grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div className="space-y-6">
                        <Label className="text-white/40 uppercase tracking-[0.2em] text-[10px] font-black">Color Architecture</Label>
                        <div className="space-y-5">
                          {[
                            { label: "Background", value: backgroundColor, setter: setBackgroundColor },
                            { label: "Primary Text", value: textColor, setter: setTextColor },
                            { label: "Highlight", value: highlightColor, setter: setHighlightColor }
                          ].map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                              <span className="text-xs font-bold uppercase tracking-widest text-white/60">{item.label}</span>
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] font-mono text-white/30 uppercase">{item.value}</span>
                                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 cursor-pointer">
                                  <input 
                                    type="color" 
                                    value={item.value} 
                                    onChange={(e) => item.setter(e.target.value)}
                                    className="absolute inset-[-50%] w-[200%] h-[200%] cursor-pointer"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-6">
                        <Label className="text-white/40 uppercase tracking-[0.2em] text-[10px] font-black">Preset Palettes</Label>
                        <div className="grid grid-cols-4 gap-3">
                          {[
                            { bg: "#000000", text: "#FFFFFF", accent: "#FACC15", name: "Cyber" },
                            { bg: "#FFFFFF", text: "#000000", accent: "#3B82F6", name: "Clean" },
                            { bg: "#1A1A1A", text: "#E5E7EB", accent: "#EF4444", name: "Danger" },
                            { bg: "#0F172A", text: "#F8FAFC", accent: "#10B981", name: "Emerald" }
                          ].map((p, i) => (
                            <button 
                              key={i}
                              onClick={() => { setBackgroundColor(p.bg); setTextColor(p.text); setHighlightColor(p.accent); }}
                              className="group flex flex-col items-center gap-2"
                            >
                              <div className="w-full aspect-square rounded-xl border border-white/10 overflow-hidden flex flex-col group-hover:scale-105 transition-transform">
                                <div className="flex-1" style={{ backgroundColor: p.bg }} />
                                <div className="h-1/3 flex">
                                  <div className="flex-1" style={{ backgroundColor: p.text }} />
                                  <div className="flex-1" style={{ backgroundColor: p.accent }} />
                                </div>
                              </div>
                              <span className="text-[9px] font-bold uppercase tracking-tighter text-white/40">{p.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="space-y-6">
                        <Label className="text-white/40 uppercase tracking-[0.2em] text-[10px] font-black">Motion Dynamics</Label>
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-8">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold uppercase tracking-widest text-white/60">Intensity</span>
                              <span className="text-[10px] font-mono text-yellow-400">75%</span>
                            </div>
                            <Slider defaultValue={[75]} max={100} step={1} className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-black" />
                          </div>
                          
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold uppercase tracking-widest text-white/60">Rhythm Sync</span>
                              <span className="text-[10px] font-mono text-blue-400">BEAT-MATCHED</span>
                            </div>
                            <div className="flex gap-2">
                              {['SNAP', 'BOUNCE', 'SMOOTH', 'GLITCH'].map((mode) => (
                                <button key={mode} className={`flex-1 py-2 rounded-lg text-[9px] font-black border transition-all ${mode === 'SNAP' ? 'bg-white text-black border-white' : 'bg-transparent text-white/40 border-white/10 hover:border-white/20'}`}>
                                  {mode}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <Label className="text-white/40 uppercase tracking-[0.2em] text-[10px] font-black">Typography Engine</Label>
                          {!isPro && <div className="flex items-center gap-1 text-[8px] font-black text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded border border-yellow-400/20"><Crown className="w-2 h-2" /> PRO</div>}
                        </div>
                        <Select defaultValue="modern">
                          <SelectTrigger className="bg-white/5 border-white/10 h-14 rounded-2xl px-6 font-bold">
                            <SelectValue placeholder="Select font style" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#111] border-white/10 text-white rounded-2xl">
                            <SelectItem value="modern" className="py-3">Modern Kinetic (Inter Black)</SelectItem>
                            <SelectItem value="minimal" className="py-3">Minimalist (SF Pro)</SelectItem>
                            <SelectItem value="brutal" className="py-3">Brutalist (Space Grotesk)</SelectItem>
                            <SelectItem value="luxury" className="py-3">Luxury (Cormorant)</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-[10px] text-white/30 italic px-2">Pro users can upload custom .OTF / .TTF fonts.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="growth" className="mt-0 space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="p-8 rounded-3xl bg-yellow-400 text-black">
                        <DollarSign className="w-12 h-12 mb-4" />
                        <h2 className="text-2xl font-black tracking-tighter uppercase leading-none mb-2">Monetization Strategy</h2>
                        <p className="text-sm font-bold opacity-80 leading-relaxed">
                          Turn your AI video engine into a profitable business. Here are the top 3 ways to earn:
                        </p>
                        <ul className="mt-6 space-y-4">
                          <li className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center font-black text-xs">1</div>
                            <p className="text-xs font-bold">SaaS Subscriptions: Charge users $19-$49/mo for Pro features (which we've already built the UI for!).</p>
                          </li>
                          <li className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center font-black text-xs">2</div>
                            <p className="text-xs font-bold">Pay-per-Render: Sell "Credits" for high-resolution 4K exports without a monthly commitment.</p>
                          </li>
                          <li className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center font-black text-xs">3</div>
                            <p className="text-xs font-bold">Agency Service: Use this tool to create viral Reels for clients and charge $50-$100 per video.</p>
                          </li>
                        </ul>
                      </div>

                      <Card className="bg-white/5 border-white/10 p-6 rounded-3xl">
                        <Globe className="w-8 h-8 text-blue-400 mb-4" />
                        <h3 className="text-lg font-black tracking-tighter uppercase mb-2">Get on Google (SEO)</h3>
                        <p className="text-xs text-white/60 leading-relaxed mb-4">
                          To appear on Google, your site needs to be "indexed". I've already added SEO meta tags to your code. Next steps:
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                            <Check className="w-4 h-4 text-green-500" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Connect Custom Domain</span>
                          </div>
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                            <Check className="w-4 h-4 text-green-500" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Submit to Search Console</span>
                          </div>
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                            <Check className="w-4 h-4 text-green-500" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Create a Sitemap.xml</span>
                          </div>
                        </div>
                      </Card>
                    </div>

                    <div className="space-y-6">
                      <div className="p-8 rounded-3xl bg-blue-600 text-white">
                        <TrendingUp className="w-12 h-12 mb-4" />
                        <h2 className="text-2xl font-black tracking-tighter uppercase leading-none mb-2">Viral Growth Hacks</h2>
                        <p className="text-sm font-bold opacity-80 leading-relaxed">
                          Marketing is about being where your customers are.
                        </p>
                        <div className="mt-6 space-y-6">
                          <div className="space-y-2">
                            <h4 className="text-xs font-black uppercase tracking-widest">1. The Watermark Loop</h4>
                            <p className="text-[11px] opacity-70">Free users get a "Made with KineticScript" watermark. Every video they share is a free ad for you.</p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-xs font-black uppercase tracking-widest">2. Social Proof</h4>
                            <p className="text-[11px] opacity-70">Post "Before vs After" videos on TikTok and Reels showing how AI transforms a boring script into a kinetic masterpiece.</p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-xs font-black uppercase tracking-widest">3. Affiliate Program</h4>
                            <p className="text-[11px] opacity-70">Give influencers a 30% commission for every Pro user they refer to your site.</p>
                          </div>
                        </div>
                      </div>

                      <Button 
                        onClick={() => setShowPricing(true)}
                        className="w-full h-16 bg-white text-black hover:bg-yellow-400 transition-all font-black text-lg rounded-3xl shadow-xl"
                      >
                        ACTIVATE PRO MONETIZATION
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="assets" className="mt-0 space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Label className="text-white/40 uppercase tracking-[0.2em] text-[10px] font-black">Background Media</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="aspect-video rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group cursor-pointer hover:border-white/20 transition-all relative overflow-hidden">
                            <Video className="w-5 h-5 text-white/20 group-hover:text-white/40 transition-colors" />
                            {!isPro && i > 1 && (
                              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                                <Crown className="w-4 h-4 text-yellow-400" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" className="w-full border-dashed border-white/10 hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest h-10">
                        Upload Asset
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <Label className="text-white/40 uppercase tracking-[0.2em] text-[10px] font-black">Overlay FX</Label>
                      <div className="space-y-3">
                        {['Dust & Grain', 'Film Burn', 'Glitch Overlay', 'VHS Texture'].map((fx, i) => (
                          <div key={fx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group cursor-pointer hover:bg-white/[0.08] transition-all">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">{fx}</span>
                            {!isPro && <Crown className="w-3 h-3 text-yellow-400/40 group-hover:text-yellow-400 transition-colors" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {!isPro && (
                    <div className="mt-12 p-8 rounded-[32px] bg-gradient-to-br from-yellow-400/10 to-transparent border border-yellow-400/20 text-center">
                      <Crown className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
                      <h3 className="text-xl font-black tracking-tighter mb-2">UNLOCK ASSET LIBRARY</h3>
                      <p className="text-white/40 text-xs max-w-xs mx-auto mb-6 leading-relaxed">
                        Get access to 500+ premium backgrounds, overlays, and sound effects to make your reels stand out.
                      </p>
                      <Button 
                        onClick={() => setShowPricing(true)}
                        className="bg-yellow-400 text-black hover:bg-yellow-500 font-black px-8 rounded-full"
                      >
                        UPGRADE NOW
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
        </section>

        {/* Right Panel: Render Preview */}
        <aside className="w-[450px] border-l border-white/5 bg-black/40 backdrop-blur-md flex flex-col">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-white/60">Live Engine</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white">
                <Maximize2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-8 bg-[#020202]">
            <div className="relative aspect-[9/16] h-full max-h-[650px] w-full bg-[#080808] rounded-[40px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5 group">
              {/* Device Frame Overlay */}
              <div className="absolute inset-0 pointer-events-none border-[12px] border-black rounded-[40px] z-20 shadow-inner" />
              
              {isGenerating ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md z-30">
                  <div className="relative w-24 h-24 mb-8">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-t-2 border-yellow-400 rounded-full"
                    />
                    <motion.div 
                      animate={{ rotate: -360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-4 border-b-2 border-blue-500 rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Video className="w-6 h-6 text-white animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-lg font-black tracking-tighter text-white uppercase mb-2">Rendering...</h3>
                  <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ x: [-200, 200] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className="w-1/2 h-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
                    />
                  </div>
                  <p className="text-[10px] text-white/30 mt-4 uppercase tracking-[0.3em] font-bold">Syncing Beats & Type</p>
                </div>
              ) : videoUrl ? (
                <video 
                  src={videoUrl} 
                  controls 
                  autoPlay 
                  loop 
                  className="w-full h-full object-cover relative z-10"
                />
              ) : (
                <div 
                  className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center relative z-10"
                  style={{ backgroundColor }}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-6"
                  >
                    <h3 
                      className="text-5xl font-black tracking-tighter leading-[0.9] uppercase italic"
                      style={{ color: textColor }}
                    >
                      {script.split('\n')[0] || "READY TO"}
                      <br />
                      <span style={{ color: highlightColor }}>CREATE?</span>
                    </h3>
                    <div className="h-px w-12 bg-white/20 mx-auto" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Engine Standby</p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute bottom-16 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <Button 
                      onClick={handleGenerate}
                      className="bg-white text-black hover:bg-yellow-400 rounded-full w-16 h-16 p-0 shadow-2xl"
                    >
                      <Play className="w-8 h-8 fill-current ml-1" />
                    </Button>
                  </motion.div>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 space-y-5 border-t border-white/5 bg-black/20">
            {audioUrl && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-yellow-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Voiceover Engine</span>
                  </div>
                  <span className="text-[9px] font-mono text-white/20">24kHz / PCM</span>
                </div>
                <audio src={audioUrl} controls className="h-8 w-full invert opacity-60 hover:opacity-100 transition-opacity" />
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="border-white/10 hover:bg-white/5 h-12 rounded-xl font-bold text-xs uppercase tracking-widest">
                <Download className="w-4 h-4 mr-2" />
                Export MP4
              </Button>
              <Button variant="outline" className="border-white/10 hover:bg-white/5 h-12 rounded-xl font-bold text-xs uppercase tracking-widest">
                <Settings2 className="w-4 h-4 mr-2" />
                Advanced
              </Button>
            </div>
          </div>
        </aside>
      </main>

      {/* Pricing Dialog */}
      <Dialog open={showPricing} onOpenChange={setShowPricing}>
        <DialogContent className="bg-[#0A0A0A] border-white/10 text-white max-w-4xl p-0 overflow-hidden rounded-[32px]">
          <div className="grid grid-cols-2 h-full">
            <div className="p-12 bg-gradient-to-br from-yellow-400/20 to-transparent flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center mb-8">
                  <Crown className="text-black w-7 h-7" />
                </div>
                <h2 className="text-4xl font-black tracking-tighter mb-4 leading-none">UNLEASH THE<br /><span className="text-yellow-400 text-5xl">PRO ENGINE</span></h2>
                <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                  Join 10,000+ creators making high-impact content with our advanced kinetic engine.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-yellow-400/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-yellow-400" />
                  </div>
                  <span className="text-xs font-bold text-white/80">4K Ultra HD Export</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-yellow-400/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-yellow-400" />
                  </div>
                  <span className="text-xs font-bold text-white/80">Advanced AI Script Doctor</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-yellow-400/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-yellow-400" />
                  </div>
                  <span className="text-xs font-bold text-white/80">Unlimited Generations</span>
                </div>
              </div>
            </div>
            <div className="p-12 bg-black flex flex-col justify-center">
              <div className="space-y-8">
                {pricingPlans.map((plan, i) => (
                  <div 
                    key={i} 
                    className={`p-6 rounded-3xl border transition-all cursor-pointer ${
                      plan.highlight 
                        ? 'bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.1)]' 
                        : 'bg-white/5 text-white border-white/10 hover:border-white/20'
                    }`}
                    onClick={() => {
                      if (plan.name === "Pro") {
                        setIsPro(true);
                        setShowPricing(false);
                        toast.success("Welcome to KineticScript Pro!");
                      }
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-black uppercase tracking-tighter">{plan.name}</h3>
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${plan.highlight ? 'text-black/40' : 'text-white/40'}`}>Monthly Subscription</p>
                      </div>
                      <div className="text-2xl font-black">{plan.price}<span className="text-xs font-bold">/mo</span></div>
                    </div>
                    <Button 
                      className={`w-full font-black uppercase tracking-widest text-[10px] h-10 rounded-xl ${
                        plan.highlight 
                          ? 'bg-black text-white hover:bg-black/90' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {plan.buttonText}
                    </Button>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-center text-white/20 mt-8 uppercase tracking-widest font-bold">Cancel anytime. Secure payment via Stripe.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
