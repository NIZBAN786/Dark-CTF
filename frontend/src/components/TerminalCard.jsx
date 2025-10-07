import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useToast } from "../hooks/use-toast";
import { ShieldCheck, LockKeyhole, Terminal, Sparkles } from "lucide-react";

const CodeBlock = ({ children }) => (
  <div className="rounded-md border border-[#161B22] bg-[#161B22] p-4 text-[#C9D1D9] shadow-[0_0_20px_rgba(0,255,65,0.05)]">
    <pre className="whitespace-pre-wrap break-words font-mono text-sm">{children}</pre>
  </div>
);

export default function TerminalCard({
  stage,
  locked,
  initialSolved,
  onSolve
}) {
  const [answer, setAnswer] = useState("");
  const [solved, setSolved] = useState(!!initialSolved);
  const { toast } = useToast();

  const accent = useMemo(() => stage?.color || "#00FF41", [stage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!stage || !stage.verify) return;
    const ok = stage.verify(answer);
    if (ok) {
      setSolved(true);
      const flag = stage.reveal ? stage.reveal() : null;
      onSolve?.(flag);
      toast({
        title: "Stage cleared",
        description: flag ? `Flag revealed: ${flag}` : "Solved!",
      });
    } else {
      toast({
        title: "Incorrect",
        description: "Try again or inspect the source for subtle hints.",
      });
    }
  };

  return (
    <Card className="relative overflow-hidden border border-[#1F2833] bg-[#0D1117]/80 backdrop-blur-sm" style={{ boxShadow: "0 0 24px rgba(0,255,65,0.08)" }}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          {solved ? (
            <ShieldCheck size={18} color="#00FF41" />
          ) : (
            <LockKeyhole size={18} color="#FF0040" />
          )}
          <CardTitle className="font-semibold tracking-wide" style={{ color: accent }}>{stage?.title}</CardTitle>
        </div>
        <Badge variant="secondary" className="bg-[#161B22] text-[#C9D1D9]">{stage?.difficulty}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-[#C9D1D9]/80">{stage?.prompt}</p>
        <CodeBlock>
{`$ cat payload.txt\n${stage?.payload}`}
        </CodeBlock>

        {locked ? (
          <div className="rounded-md border border-[#1F2833] bg-[#0D1117] p-4 text-[#C9D1D9]/80">
            <div className="flex items-center gap-2">
              <Terminal size={16} color="#F78166" />
              <span>This stage is locked. Clear previous stages to continue.</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Input
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your decoded phrase here..."
                    className="font-mono focus:ring-2 focus:ring-[#00FF41]/30"
                  />
                </TooltipTrigger>
                <TooltipContent className="bg-[#161B22] text-[#C9D1D9]">
                  Press Enter to submit. Inspect source for hidden breadcrumbs.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex items-center gap-3">
              <Button
                type="submit"
                className="bg-[#00FF41] text-black hover:opacity-90 transition-opacity"
              >
                Submit
              </Button>
              {solved && (
                <div className="inline-flex items-center gap-2 text-[#00FF41]">
                  <Sparkles size={16} />
                  <span className="text-sm">Solved. Flag unlocked above in toast.</span>
                </div>
              )}
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}