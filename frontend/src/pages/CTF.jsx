import React, { useEffect, useMemo, useState } from "react";
import TerminalCard from "../components/TerminalCard";
import { PUZZLES, getProgress, isUnlocked, setStageSolved, listStages, getMasterFlag, resetProgress } from "../mock/mock";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { Toaster } from "../components/ui/toaster";
import { useToast } from "../hooks/use-toast";
import { Flag, Lock, Unlock, Swords, Menu, RefreshCw } from "lucide-react";

export default function CTF() {
  const [active, setActive] = useState("s1");
  const [progress, setProgress] = useState(getProgress());
  const { toast } = useToast();

  useEffect(() => {
    // default to first unlocked
    if (!isUnlocked(active)) setActive("s1");
  }, []);

  const pct = useMemo(() => {
    const solvedCount = ["s1", "s2", "s3"].filter(k => progress?.solved?.[k]).length;
    return Math.round((solvedCount / 3) * 100);
  }, [progress]);

  const stages = listStages();

  const currentStage = useMemo(() => {
    if (active === "master") return null;
    return PUZZLES.find(p => p.id === active);
  }, [active]);

  const handleSolve = (flag) => {
    const updated = setStageSolved(active, flag);
    setProgress(updated);
  };

  const handleReset = () => {
    resetProgress();
    const p = getProgress();
    setProgress(p);
    setActive("s1");
    toast({ title: "Progress reset", description: "All local progress cleared." });
  };

  const MasterView = () => {
    const flag = getMasterFlag();
    const unlocked = isUnlocked("master");
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[#00FF41]">Master Flag</h2>
        {!unlocked ? (
          <div className="rounded-md border border-[#1F2833] bg-[#0D1117] p-4 text-[#C9D1D9]">
            Clear all three stages to reveal the master flag.
          </div>
        ) : (
          <div className="rounded-md border border-[#1F2833] bg-[#161B22] p-4" style={{ boxShadow: "0 0 24px rgba(247,129,102,0.15)" }}>
            <div className="flex items-center gap-2 text-[#F78166]">
              <Flag size={16} />
              <span className="text-sm">Congratulations!</span>
            </div>
            <div className="mt-2 font-mono text-[#00FF41]">{flag}</div>
          </div>
        )}
      </div>
    );
  };

  const Sidebar = () => (
    <div className="hidden w-64 flex-shrink-0 lg:block">
      <div className="sticky top-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold tracking-wide" style={{ color: "#00FF41" }}>DarkCTF</h1>
          <Badge className="bg-[#161B22] text-[#C9D1D9]">Crypto</Badge>
        </div>
        <div>
          <div className="mb-2 text-xs uppercase text-[#C9D1D9]/60">Progress</div>
          <Progress value={pct} className="h-2 bg-[#161B22]" />
          <div className="mt-2 text-xs text-[#C9D1D9]/60">{pct}% Complete</div>
        </div>
        <Separator className="bg-[#1F2833]" />
        <nav className="space-y-2">
          {stages.map(s => {
            const unlocked = isUnlocked(s.id);
            const solved = !!progress?.solved?.[s.id];
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`group flex w-full items-center justify-between rounded-md border border-[#1F2833] px-3 py-2 text-left ${active === s.id ? "bg-[#161B22]" : "bg-transparent hover:bg-[#0D1117]"}`}
              >
                <div className="flex items-center gap-2">
                  {unlocked ? <Unlock size={16} color="#00FF41" /> : <Lock size={16} color="#FF0040" />}
                  <span className="text-sm text-[#C9D1D9]">{s.label}</span>
                </div>
                {solved && <Badge className="bg-[#00FF41] text-black">Solved</Badge>}
              </button>
            );
          })}
        </nav>
        <Separator className="bg-[#1F2833]" />
        <Button onClick={handleReset} variant="outline" className="w-full border-[#1F2833] bg-[#0D1117] text-[#C9D1D9] hover:bg-[#161B22]">
          <RefreshCw size={16} className="mr-2" /> Reset Progress
        </Button>
      </div>
    </div>
  );

  const MobileNav = () => (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button className="border border-[#1F2833] bg-[#0D1117] text-[#C9D1D9] hover:bg-[#161B22]">
            <Menu size={16} className="mr-2" /> Menu
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-[#0D1117] text-[#C9D1D9]">
          {stages.map(s => {
            const unlocked = isUnlocked(s.id);
            const solved = !!progress?.solved?.[s.id];
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`mb-2 flex w-full items-center justify-between rounded-md border border-[#1F2833] px-3 py-2 text-left ${active === s.id ? "bg-[#161B22]" : "bg-transparent hover:bg-[#0D1117]"}`}
              >
                <div className="flex items-center gap-2">
                  {unlocked ? <Unlock size={16} color="#00FF41" /> : <Lock size={16} color="#FF0040" />}
                  <span className="text-sm text-[#C9D1D9]">{s.label}</span>
                </div>
                {solved && <Badge className="bg-[#00FF41] text-black">Solved</Badge>}
              </button>
            );
          })}
        </SheetContent>
      </Sheet>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#C9D1D9]">
      <Toaster />
      <header className="sticky top-0 z-10 border-b border-[#1F2833] bg-[#0D1117]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Swords size={18} color="#00FF41" />
            <span className="font-bold tracking-wide" style={{ color: "#00FF41" }}>DarkCTF</span>
            <Badge className="ml-2 bg-[#161B22] text-[#C9D1D9]">Crypto</Badge>
          </div>
          <MobileNav />
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
        <Sidebar />
        <div className="flex-1 space-y-6">
          {active === "master" ? (
            <MasterView />
          ) : (
            <TerminalCard
              stage={currentStage}
              locked={!isUnlocked(active)}
              initialSolved={!!progress?.solved?.[active]}
              onSolve={handleSolve}
            />
          )}

          {/* Inline stage flags panel */}
          <div className="rounded-md border border-[#1F2833] bg-[#0D1117] p-4">
            <div className="mb-2 text-sm text-[#C9D1D9]/70">Discovered Flags</div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {["s1", "s2", "s3"].map(k => (
                <div key={k} className="rounded border border-[#1F2833] bg-[#161B22] p-3">
                  <div className="flex items-center gap-2 text-xs text-[#C9D1D9]/60">
                    <Flag size={14} /> {k.toUpperCase()} FLAG
                  </div>
                  <div className="mt-1 font-mono text-sm text-[#00FF41]">
                    {progress?.flags?.[k] || "—"}
                  </div>
                </div>
              ))}
              <div className="rounded border border-[#1F2833] bg-[#161B22] p-3">
                <div className="flex items-center gap-2 text-xs text-[#C9D1D9]/60">
                  <Flag size={14} /> MASTER FLAG
                </div>
                <div className="mt-1 font-mono text-sm text-[#00FF41]">
                  {progress?.flags?.master || "—"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#1F2833]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-xs text-[#C9D1D9]/60">
          <span>Built for cryptographic fun. Frontend-only mock.</span>
          <span>Theme: Matrix Green • Cyber Red</span>
        </div>
      </footer>
    </div>
  );
}