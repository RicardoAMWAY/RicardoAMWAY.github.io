import React, { useState } from 'react';

interface Team {
  name: string;
  progress: ProgressValue;
}

type ProgressValue = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 'J' | 'Q' | 'K' | 'A';

const progressOrder: ProgressValue[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];

interface VictoryModalProps {
  isOpen: boolean;
  winnerName: string;
  onNewGame: () => void;
}

const VictoryModal: React.FC<VictoryModalProps> = ({ isOpen, winnerName, onNewGame }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 flex flex-col items-center">
        <h3 className="text-[#0d141c] text-2xl font-bold mb-6">
          恭喜{winnerName}获得胜利
        </h3>
        <button
          onClick={onNewGame}
          className="flex min-w-[120px] items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-[#3490f3] text-slate-50 text-sm font-bold leading-normal tracking-[0.015em]"
        >
          <span className="truncate">再来一局</span>
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [teamA, setTeamA] = useState<Team>({ name: '', progress: 2 });
  const [teamB, setTeamB] = useState<Team>({ name: '', progress: 2 });
  const [currentTeam, setCurrentTeam] = useState<'A' | 'B' | ''>('');
  const [initialTeam, setInitialTeam] = useState<'A' | 'B' | ''>('');
  const [gameStarted, setGameStarted] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [winner, setWinner] = useState<'A' | 'B' | ''>('');
  const [buttonCooldown, setButtonCooldown] = useState(false);

  const handleReset = () => {
    setTeamA({ name: teamA.name, progress: 2 });
    setTeamB({ name: teamB.name, progress: 2 });
    setCurrentTeam('');
    setInitialTeam('');
    setGameStarted(false);
    setShowVictoryModal(false);
    setWinner('');
  };

  const updateProgress = (team: Team, steps: number): ProgressValue => {
    const currentIndex = progressOrder.indexOf(team.progress);
    const rawNextIndex = currentIndex + steps;
    
    if (team.progress !== 'A' && rawNextIndex >= progressOrder.length - 1) {
      return 'A';
    }
    
    if (team.progress === 'A' && steps > 0) {
      return 'A';
    }
    
    const nextIndex = Math.min(rawNextIndex, progressOrder.length - 1);
    return progressOrder[nextIndex];
  };

  const checkVictory = (team: Team, teamId: 'A' | 'B') => {
    if (team.progress === 'A') {
      setWinner(teamId);
      setShowVictoryModal(true);
      return true;
    }
    return false;
  };

  const handleProgressUpdate = (team: 'A' | 'B', baseProgress: number) => {
    if (buttonCooldown) return;
    
    setButtonCooldown(true);
    setTimeout(() => {
      setButtonCooldown(false);
    }, 3000);

    if (team === 'A') {
      if (baseProgress === 2) {
        if (currentTeam === 'A') {
          const newProgress = updateProgress(teamA, 3);
          setTeamA({ ...teamA, progress: newProgress });
          if (teamA.progress === 'A') {
            checkVictory({ ...teamA, progress: newProgress }, 'A');
          }
        } else {
          const newProgress = updateProgress(teamA, 2);
          setTeamA({ ...teamA, progress: newProgress });
          setCurrentTeam('A');
          if (teamA.progress === 'A') {
            checkVictory({ ...teamA, progress: newProgress }, 'A');
          }
        }
      } else if (baseProgress === 3) {
        if (currentTeam === 'A') {
          const newProgress = updateProgress(teamA, 2);
          setTeamA({ ...teamA, progress: newProgress });
          if (teamA.progress === 'A') {
            checkVictory({ ...teamA, progress: newProgress }, 'A');
          }
        } else {
          const newProgress = updateProgress(teamA, 1);
          setTeamA({ ...teamA, progress: newProgress });
          setCurrentTeam('A');
          if (teamA.progress === 'A') {
            checkVictory({ ...teamA, progress: newProgress }, 'A');
          }
        }
      } else if (baseProgress === 4) {
        if (currentTeam === 'A') {
          const newProgress = updateProgress(teamA, 1);
          setTeamA({ ...teamA, progress: newProgress });
          if (teamA.progress === 'A') {
            checkVictory({ ...teamA, progress: newProgress }, 'A');
          }
        } else {
          setCurrentTeam('A');
        }
      }
    } else {
      if (baseProgress === 2) {
        if (currentTeam === 'B') {
          const newProgress = updateProgress(teamB, 3);
          setTeamB({ ...teamB, progress: newProgress });
          if (teamB.progress === 'A') {
            checkVictory({ ...teamB, progress: newProgress }, 'B');
          }
        } else {
          const newProgress = updateProgress(teamB, 2);
          setTeamB({ ...teamB, progress: newProgress });
          setCurrentTeam('B');
          if (teamB.progress === 'A') {
            checkVictory({ ...teamB, progress: newProgress }, 'B');
          }
        }
      } else if (baseProgress === 3) {
        if (currentTeam === 'B') {
          const newProgress = updateProgress(teamB, 2);
          setTeamB({ ...teamB, progress: newProgress });
          if (teamB.progress === 'A') {
            checkVictory({ ...teamB, progress: newProgress }, 'B');
          }
        } else {
          const newProgress = updateProgress(teamB, 1);
          setTeamB({ ...teamB, progress: newProgress });
          setCurrentTeam('B');
          if (teamB.progress === 'A') {
            checkVictory({ ...teamB, progress: newProgress }, 'B');
          }
        }
      } else if (baseProgress === 4) {
        if (currentTeam === 'B') {
          const newProgress = updateProgress(teamB, 1);
          setTeamB({ ...teamB, progress: newProgress });
          if (teamB.progress === 'A') {
            checkVictory({ ...teamB, progress: newProgress }, 'B');
          }
        } else {
          setCurrentTeam('B');
        }
      }
    }
  };

  const getCurrentTeamName = () => {
    if (currentTeam === 'A') {
      return teamA.name || `团队 A`;
    } else if (currentTeam === 'B') {
      return teamB.name || `团队 B`;
    } else {
      return '未选择';
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden" style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}>
      <VictoryModal 
        isOpen={showVictoryModal} 
        winnerName={winner === 'A' ? (teamA.name || '团队 A') : (teamB.name || '团队 B')}
        onNewGame={handleReset}
      />
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
            <h2 className="text-[#0d141c] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">掼蛋记分器</h2>
            
            <h2 className="text-[#0d141c] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">团队名称</h2>
            <div className="flex flex-col gap-3 px-4 py-3">
              <div className="flex items-center gap-4">
                <div className="w-[240px]">
                  <input
                    placeholder="团队 A"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d141c] focus:outline-0 focus:ring-0 border border-[#cedbe8] bg-slate-50 focus:border-[#cedbe8] h-14 placeholder:text-[#49719c] p-[15px] text-base font-normal leading-normal"
                    value={teamA.name}
                    onChange={(e) => setTeamA({ ...teamA, name: e.target.value })}
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-[#3490f3] rounded border-[#cedbe8]"
                    checked={initialTeam === 'A'}
                    onChange={() => !gameStarted && setInitialTeam(initialTeam === 'A' ? '' : 'A')}
                    disabled={gameStarted}
                  />
                  <span className="text-[#0d141c] text-sm">设为初始玩家</span>
                </label>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-[240px]">
                  <input
                    placeholder="团队 B"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d141c] focus:outline-0 focus:ring-0 border border-[#cedbe8] bg-slate-50 focus:border-[#cedbe8] h-14 placeholder:text-[#49719c] p-[15px] text-base font-normal leading-normal"
                    value={teamB.name}
                    onChange={(e) => setTeamB({ ...teamB, name: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-[#3490f3] rounded border-[#cedbe8]"
                      checked={initialTeam === 'B'}
                      onChange={() => !gameStarted && setInitialTeam(initialTeam === 'B' ? '' : 'B')}
                      disabled={gameStarted}
                    />
                    <span className="text-[#0d141c] text-sm">设为初始玩家</span>
                  </label>
                  <button
                    onClick={() => {
                      if (initialTeam) {
                        setGameStarted(true);
                        setCurrentTeam(initialTeam);
                      }
                    }}
                    disabled={!initialTeam}
                    className={`flex min-w-[84px] items-center justify-center overflow-hidden rounded-full h-10 px-4 text-sm font-bold leading-normal tracking-[0.015em] ${
                      initialTeam && !gameStarted
                        ? 'cursor-pointer bg-[#3490f3] text-slate-50'
                        : 'cursor-not-allowed bg-[#f0f3f8] text-[#8494a5]'
                    }`}
                  >
                    <span className="truncate">开始游戏</span>
                  </button>
                </div>
              </div>
            </div>

            <h2 className="text-[#0d141c] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">当前进度</h2>
            <div className="flex justify-between items-center px-4 py-3">
              <div className="flex flex-col items-center">
                <p className="text-[#0d141c] text-sm font-normal leading-normal">当前玩家</p>
                <p className="text-[#0d141c] text-2xl font-bold leading-normal mt-2">
                  {getCurrentTeamName()}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-[#0d141c] text-sm font-normal leading-normal">当前进度</p>
                <p className="text-[#0d141c] text-[48px] font-bold leading-normal mt-2">
                  {currentTeam ? (currentTeam === 'A' ? teamA.progress : teamB.progress) : '-'}
                </p>
              </div>
              <div className="flex flex-col items-center justify-end">
                <button
                  onClick={handleReset}
                  className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#e7edf4] text-[#0d141c] text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate">重置</span>
                </button>
              </div>
            </div>

            <h2 className="text-[#0d141c] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">玩家记录</h2>
            <div className="flex justify-between px-4 py-3">
              <div className="flex-1 bg-[#f0f3f8] rounded-2xl p-4 mr-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[#0d141c] text-base font-bold">{teamA.name || "团队A"}</p>
                  <div className="flex items-center">
                    <span className="text-[#49719c] text-sm mr-2">进度</span>
                    <span className="text-[#0d141c] text-2xl font-bold">{teamA.progress}</span>
                  </div>
                </div>
                <div className={`h-1 w-full rounded-full bg-[#e7edf4] overflow-hidden`}>
                  <div 
                    className="h-full bg-[#3490f3] transition-all duration-300" 
                    style={{ 
                      width: `${((progressOrder.indexOf(teamA.progress) + 1) / progressOrder.length) * 100}%` 
                    }}
                  />
                </div>
              </div>
              <div className="flex-1 bg-[#f0f3f8] rounded-2xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[#0d141c] text-base font-bold">{teamB.name || "团队B"}</p>
                  <div className="flex items-center">
                    <span className="text-[#49719c] text-sm mr-2">进度</span>
                    <span className="text-[#0d141c] text-2xl font-bold">{teamB.progress}</span>
                  </div>
                </div>
                <div className={`h-1 w-full rounded-full bg-[#e7edf4] overflow-hidden`}>
                  <div 
                    className="h-full bg-[#3490f3] transition-all duration-300" 
                    style={{ 
                      width: `${((progressOrder.indexOf(teamB.progress) + 1) / progressOrder.length) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </div>

            <h2 className="text-[#0d141c] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">调整进度</h2>
            <div className="flex justify-between px-4">
              <div className="flex flex-col items-center gap-3">
                <h3 className="text-[#0d141c] text-base font-bold">{teamA.name || "团队A"}获胜</h3>
                <button
                  onClick={() => handleProgressUpdate('A', 2)}
                  disabled={!currentTeam || !gameStarted || buttonCooldown}
                  className={`flex min-w-[200px] items-center justify-center overflow-hidden rounded-full h-10 px-6 text-sm font-bold leading-normal tracking-[0.015em] ${
                    currentTeam && gameStarted && !buttonCooldown ? 'cursor-pointer bg-[#e7edf4] text-[#0d141c]' : 'cursor-not-allowed bg-[#f0f3f8] text-[#8494a5]'
                  }`}
                >
                  <span className="truncate">{teamA.name || "团队A"}获得第2名</span>
                </button>
                <button
                  onClick={() => handleProgressUpdate('A', 3)}
                  disabled={!currentTeam || !gameStarted || buttonCooldown}
                  className={`flex min-w-[200px] items-center justify-center overflow-hidden rounded-full h-10 px-6 text-sm font-bold leading-normal tracking-[0.015em] ${
                    currentTeam && gameStarted && !buttonCooldown ? 'cursor-pointer bg-[#e7edf4] text-[#0d141c]' : 'cursor-not-allowed bg-[#f0f3f8] text-[#8494a5]'
                  }`}
                >
                  <span className="truncate">{teamA.name || "团队A"}获得第3名</span>
                </button>
                <button
                  onClick={() => handleProgressUpdate('A', 4)}
                  disabled={!currentTeam || !gameStarted || buttonCooldown}
                  className={`flex min-w-[200px] items-center justify-center overflow-hidden rounded-full h-10 px-6 text-sm font-bold leading-normal tracking-[0.015em] ${
                    currentTeam && gameStarted && !buttonCooldown ? 'cursor-pointer bg-[#e7edf4] text-[#0d141c]' : 'cursor-not-allowed bg-[#f0f3f8] text-[#8494a5]'
                  }`}
                >
                  <span className="truncate">{teamA.name || "团队A"}获得第4名</span>
                </button>
              </div>
              <div className="flex flex-col items-center gap-3">
                <h3 className="text-[#0d141c] text-base font-bold">{teamB.name || "团队B"}获胜</h3>
                <button
                  onClick={() => handleProgressUpdate('B', 2)}
                  disabled={!currentTeam || !gameStarted || buttonCooldown}
                  className={`flex min-w-[200px] items-center justify-center overflow-hidden rounded-full h-10 px-6 text-sm font-bold leading-normal tracking-[0.015em] ${
                    currentTeam && gameStarted && !buttonCooldown ? 'cursor-pointer bg-[#e7edf4] text-[#0d141c]' : 'cursor-not-allowed bg-[#f0f3f8] text-[#8494a5]'
                  }`}
                >
                  <span className="truncate">{teamB.name || "团队B"}获得第2名</span>
                </button>
                <button
                  onClick={() => handleProgressUpdate('B', 3)}
                  disabled={!currentTeam || !gameStarted || buttonCooldown}
                  className={`flex min-w-[200px] items-center justify-center overflow-hidden rounded-full h-10 px-6 text-sm font-bold leading-normal tracking-[0.015em] ${
                    currentTeam && gameStarted && !buttonCooldown ? 'cursor-pointer bg-[#e7edf4] text-[#0d141c]' : 'cursor-not-allowed bg-[#f0f3f8] text-[#8494a5]'
                  }`}
                >
                  <span className="truncate">{teamB.name || "团队B"}获得第3名</span>
                </button>
                <button
                  onClick={() => handleProgressUpdate('B', 4)}
                  disabled={!currentTeam || !gameStarted || buttonCooldown}
                  className={`flex min-w-[200px] items-center justify-center overflow-hidden rounded-full h-10 px-6 text-sm font-bold leading-normal tracking-[0.015em] ${
                    currentTeam && gameStarted && !buttonCooldown ? 'cursor-pointer bg-[#e7edf4] text-[#0d141c]' : 'cursor-not-allowed bg-[#f0f3f8] text-[#8494a5]'
                  }`}
                >
                  <span className="truncate">{teamB.name || "团队B"}获得第4名</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 