import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

interface Team {
  name: string;
  progress: ProgressValue;
}

type ProgressValue = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 'J' | 'Q' | 'K' | 'A' | 'A1' | 'A2' | 'A3';

type GameMode = '官方规则' | '慢速打法';

// 慢速打法进度顺序（原有逻辑）
const slowProgressOrder: ProgressValue[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];

// 官方规则进度顺序
const officialProgressOrder: ProgressValue[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A1', 'A2', 'A3'];

interface VictoryModalProps {
  isOpen: boolean;
  winnerName: string;
  onNewGame: () => void;
  gameTime: string;
}

const VictoryModal: React.FC<VictoryModalProps> = ({ isOpen, winnerName, onNewGame, gameTime }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4 flex flex-col items-center">
        <h3 className="text-[#0d141c] text-xl sm:text-2xl font-bold mb-4 text-center">
          恭喜{winnerName}获得胜利
        </h3>
        <p className="text-[#49719c] text-base mb-6 text-center">
          本次游戏共用时：{gameTime}
        </p>
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

interface BattleAnimationProps {
  isVisible: boolean;
  onAnimationEnd: () => void;
}

const BattleAnimation: React.FC<BattleAnimationProps> = ({ isVisible, onAnimationEnd }) => {
  
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onAnimationEnd();
      }, 1000); // 动画持续1秒
      return () => clearTimeout(timer);
    }
  }, [isVisible, onAnimationEnd]);

  if (!isVisible) {
    return null;
  }

  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-lg h-80 sm:w-96 sm:h-96 flex items-center justify-center">
        {/* 左边的中世纪骑士剑 */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 animate-sword-left">
          <img 
            src="/sword_left.svg" 
            alt="左剑" 
            className="w-72 h-72 sm:w-80 sm:h-80 object-contain"
          />
        </div>
        
        {/* 右边的中世纪骑士剑 */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 animate-sword-right">
          <img 
            src="/sword_right.svg" 
            alt="右剑" 
            className="w-72 h-72 sm:w-80 sm:h-80 object-contain"
          />
        </div>
        
        {/* 碰撞火花效果 - 增强版 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 rounded-full animate-spark-outer opacity-0"></div>
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full animate-spark opacity-0 absolute"></div>
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-200 rounded-full animate-spark-inner opacity-0 absolute"></div>
        </div>
        
        {/* 战斗文字 - 更有气势 */}
        <div className="absolute bottom-8 sm:bottom-16 left-1/2 transform -translate-x-1/2 px-4">
          <h2 className="text-white text-lg sm:text-2xl font-bold animate-pulse drop-shadow-lg text-center whitespace-nowrap">⚔️ 骑士决斗 ⚔️</h2>
          <p className="text-gray-300 text-center mt-1 sm:mt-2 animate-pulse text-sm sm:text-base whitespace-nowrap">荣耀之战即将开始</p>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [gameMode, setGameMode] = useState<GameMode>('官方规则');
  const [teamA, setTeamA] = useState<Team>({ name: '', progress: 2 });
  const [teamB, setTeamB] = useState<Team>({ name: '', progress: 2 });
  const [currentTeam, setCurrentTeam] = useState<'A' | 'B' | ''>('');
  const [initialTeam, setInitialTeam] = useState<'A' | 'B' | ''>('');
  const [gameStarted, setGameStarted] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [winner, setWinner] = useState<'A' | 'B' | ''>('');
  const [buttonCooldown, setButtonCooldown] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [gameTime, setGameTime] = useState('');
  const [showBattleAnimation, setShowBattleAnimation] = useState(false);

  // 获取当前模式的进度顺序
  const getProgressOrder = () => {
    return gameMode === '慢速打法' ? slowProgressOrder : officialProgressOrder;
  };

  // 获取进度的显示值（官方规则下A1/A2/A3都显示为A1）
  const getDisplayProgress = (progress: ProgressValue) => {
    // 移除强制显示A1的逻辑，让A1、A2、A3分别显示其真实值
    return progress;
  };

  const shootConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      angle: 90,
      origin: { x: Math.random(), y: Math.random() },
      colors: ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee']
    });
  };

  useEffect(() => {
    if (showVictoryModal) {
      // 立即开始第一次烟花
      shootConfetti();
      shootConfetti();
      
      const intervalId = setInterval(() => {
        shootConfetti();
        shootConfetti();
      }, 600);
      
      return () => clearInterval(intervalId);
    }
  }, [showVictoryModal]);

  const handleReset = () => {
    setTeamA({ name: teamA.name, progress: 2 });
    setTeamB({ name: teamB.name, progress: 2 });
    setCurrentTeam('');
    setInitialTeam('');
    setGameStarted(false);
    setShowVictoryModal(false);
    setWinner('');
    setGameStartTime(null);
    setGameTime('');
  };

  const handleModeChange = (newMode: GameMode) => {
    setGameMode(newMode);
    // 切换模式时调用清空功能
    handleReset();
  };

  const formatGameTime = (startTime: number) => {
    const duration = Math.floor((Date.now() - startTime) / 1000); // 转换为秒
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}小时${minutes}分钟`;
    }
    return `${minutes}分钟`;
  };

  const updateProgress = (team: Team, steps: number): ProgressValue => {
    const progressOrder = getProgressOrder();
    const currentIndex = progressOrder.indexOf(team.progress);
    const rawNextIndex = currentIndex + steps;
    
    if (gameMode === '慢速打法') {
      // 慢速打法的原有逻辑
      if (team.progress !== 'A' && rawNextIndex >= progressOrder.length - 1) {
        return 'A';
      }
      
      if (team.progress === 'A' && steps > 0) {
        return 'A';
      }
      
      const nextIndex = Math.min(rawNextIndex, progressOrder.length - 1);
      return progressOrder[nextIndex];
    } else {
      // 官方规则逻辑
      const nextIndex = Math.min(rawNextIndex, progressOrder.length - 1);
      return progressOrder[nextIndex];
    }
  };

  const updateProgressOfficial = (team: Team, steps: number, maxToA1: boolean = false): ProgressValue => {
    const progressOrder = getProgressOrder();
    const currentIndex = progressOrder.indexOf(team.progress);
    const rawNextIndex = currentIndex + steps;
    
    if (maxToA1) {
      // 最大加到A1
      const a1Index = progressOrder.indexOf('A1');
      const nextIndex = Math.min(rawNextIndex, a1Index);
      return progressOrder[nextIndex];
    } else {
      const nextIndex = Math.min(rawNextIndex, progressOrder.length - 1);
      return progressOrder[nextIndex];
    }
  };

  const handleProgressUpdate = (team: 'A' | 'B', baseProgress: number) => {
    if (buttonCooldown) return;
    
    setButtonCooldown(true);
    setTimeout(() => {
      setButtonCooldown(false);
    }, 3000);

    if (gameMode === '慢速打法') {
      // 使用原有逻辑
      handleSlowModeProgressUpdate(team, baseProgress);
    } else {
      // 使用官方规则逻辑
      handleOfficialModeProgressUpdate(team, baseProgress);
    }
  };

  const handleSlowModeProgressUpdate = (team: 'A' | 'B', baseProgress: number) => {
    if (team === 'A') {
      if (baseProgress === 2) {
        if (currentTeam === 'A') {
          // 检查是否已经是A且获得进步，如果是则获胜
          if (teamA.progress === 'A') {
            if (gameStartTime) {
              const time = formatGameTime(gameStartTime);
              setGameTime(time);
              setWinner('A');
              setShowVictoryModal(true);
            }
          } else {
            const newProgress = updateProgress(teamA, 3);
            setTeamA({ ...teamA, progress: newProgress });
          }
        } else {
          const newProgress = updateProgress(teamA, 2);
          setTeamA({ ...teamA, progress: newProgress });
          setCurrentTeam('A');
        }
      } else if (baseProgress === 3) {
        if (currentTeam === 'A') {
          // 检查是否已经是A且获得进步，如果是则获胜
          if (teamA.progress === 'A') {
            if (gameStartTime) {
              const time = formatGameTime(gameStartTime);
              setGameTime(time);
              setWinner('A');
              setShowVictoryModal(true);
            }
          } else {
            const newProgress = updateProgress(teamA, 2);
            setTeamA({ ...teamA, progress: newProgress });
          }
        } else {
          const newProgress = updateProgress(teamA, 1);
          setTeamA({ ...teamA, progress: newProgress });
          setCurrentTeam('A');
        }
      } else if (baseProgress === 4) {
        if (currentTeam === 'A') {
          // 检查是否已经是A且获得进步，如果是则获胜
          if (teamA.progress === 'A') {
            if (gameStartTime) {
              const time = formatGameTime(gameStartTime);
              setGameTime(time);
              setWinner('A');
              setShowVictoryModal(true);
            }
          } else {
            const newProgress = updateProgress(teamA, 1);
            setTeamA({ ...teamA, progress: newProgress });
          }
        } else {
          setCurrentTeam('A');
        }
      }
    } else {
      // 团队B的逻辑类似
      if (baseProgress === 2) {
        if (currentTeam === 'B') {
          // 检查是否已经是A且获得进步，如果是则获胜
          if (teamB.progress === 'A') {
            if (gameStartTime) {
              const time = formatGameTime(gameStartTime);
              setGameTime(time);
              setWinner('B');
              setShowVictoryModal(true);
            }
          } else {
            const newProgress = updateProgress(teamB, 3);
            setTeamB({ ...teamB, progress: newProgress });
          }
        } else {
          const newProgress = updateProgress(teamB, 2);
          setTeamB({ ...teamB, progress: newProgress });
          setCurrentTeam('B');
        }
      } else if (baseProgress === 3) {
        if (currentTeam === 'B') {
          // 检查是否已经是A且获得进步，如果是则获胜
          if (teamB.progress === 'A') {
            if (gameStartTime) {
              const time = formatGameTime(gameStartTime);
              setGameTime(time);
              setWinner('B');
              setShowVictoryModal(true);
            }
          } else {
            const newProgress = updateProgress(teamB, 2);
            setTeamB({ ...teamB, progress: newProgress });
          }
        } else {
          const newProgress = updateProgress(teamB, 1);
          setTeamB({ ...teamB, progress: newProgress });
          setCurrentTeam('B');
        }
      } else if (baseProgress === 4) {
        if (currentTeam === 'B') {
          // 检查是否已经是A且获得进步，如果是则获胜
          if (teamB.progress === 'A') {
            if (gameStartTime) {
              const time = formatGameTime(gameStartTime);
              setGameTime(time);
              setWinner('B');
              setShowVictoryModal(true);
            }
          } else {
            const newProgress = updateProgress(teamB, 1);
            setTeamB({ ...teamB, progress: newProgress });
          }
        } else {
          setCurrentTeam('B');
        }
      }
    }
  };

  const handleOfficialModeProgressUpdate = (team: 'A' | 'B', baseProgress: number) => {
    const currentTeamData = team === 'A' ? teamA : teamB;
    const setTeamData = team === 'A' ? setTeamA : setTeamB;
    
    // 更新当前玩家显示
    setCurrentTeam(team);
    
    // 检查是否在A1/A2/A3等级
    const isInALevels = ['A1', 'A2', 'A3'].includes(currentTeamData.progress as string);
    
    if (!isInALevels) {
      // 4.3/4.4: 在团队进度不为A1或A2或A3时
      let steps = 0;
      if (baseProgress === 2) steps = 3;
      else if (baseProgress === 3) steps = 2;
      else if (baseProgress === 4) steps = 1;
      
      const newProgress = updateProgressOfficial(currentTeamData, steps, true);
      setTeamData({ ...currentTeamData, progress: newProgress });
    } else {
      // 4.5/4.6: 在A1/A2/A3等级时的特殊逻辑
      if (currentTeamData.progress === 'A3' && baseProgress === 4) {
        // A3等级点击第4名，回到2
        setTeamData({ ...currentTeamData, progress: 2 });
      } else if ((currentTeamData.progress === 'A1' || currentTeamData.progress === 'A2') && baseProgress === 4) {
        // A1/A2等级点击第4名，进度+1
        const newProgress = updateProgressOfficial(currentTeamData, 1);
        setTeamData({ ...currentTeamData, progress: newProgress });
      } else if ((baseProgress === 2 || baseProgress === 3)) {
        // A1/A2/A3等级点击第2名或第3名，获胜
        if (gameStartTime) {
          const time = formatGameTime(gameStartTime);
          setGameTime(time);
          setWinner(team);
          setShowVictoryModal(true);
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

  const handleBattleAnimationEnd = () => {
    setShowBattleAnimation(false);
    // 动画结束后滚动到页面底部
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }, 100); // 稍微延迟确保动画完全结束
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden" style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}>
      <VictoryModal 
        isOpen={showVictoryModal} 
        winnerName={winner === 'A' ? (teamA.name || '团队 A') : (teamB.name || '团队 B')}
        onNewGame={handleReset}
        gameTime={gameTime}
      />
      <BattleAnimation 
        isVisible={showBattleAnimation} 
        onAnimationEnd={handleBattleAnimationEnd}
      />
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-1 sm:px-8 lg:px-40 flex flex-1 justify-center py-2 sm:py-5">
          <div className="layout-content-container flex flex-col w-full max-w-[800px] py-2 sm:py-5 flex-1">
            {/* 标题和模式选择 */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-2 sm:px-4 pb-3 pt-2 sm:pt-5 gap-3 sm:gap-4">
              <h2 className="text-[#0d141c] tracking-light text-xl sm:text-[28px] font-bold leading-tight">掼蛋记分器</h2>
              <div className="flex items-center gap-2">
                <label className="text-[#0d141c] text-sm font-medium">模式选择</label>
                <select
                  value={gameMode}
                  onChange={(e) => handleModeChange(e.target.value as GameMode)}
                  className="form-select rounded-lg border border-[#cedbe8] bg-slate-50 px-3 py-2 text-[#0d141c] text-sm focus:outline-0 focus:ring-0 focus:border-[#3490f3] min-h-[48px]"
                >
                  <option value="官方规则">官方规则</option>
                  <option value="慢速打法">慢速打法</option>
                </select>
              </div>
            </div>
            
            <h2 className="text-[#0d141c] text-xl sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-2 sm:px-4 pb-2 pt-4">团队名称</h2>
            
            <div className="flex flex-col gap-4 px-2 sm:px-4 py-3">
              {/* 第一行：团队A输入框 | 设为初始玩家 */}
              <div className="flex items-center gap-3">
                <input
                  placeholder="团队 A"
                  className="form-input flex min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d141c] focus:outline-0 focus:ring-0 border border-[#cedbe8] bg-slate-50 focus:border-[#cedbe8] h-8 sm:h-10 placeholder:text-[#49719c] p-[8px] sm:p-[10px] text-base font-normal leading-normal"
                  value={teamA.name}
                  onChange={(e) => setTeamA({ ...teamA, name: e.target.value })}
                />
                <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="radio"
                    name="initialTeam"
                    className="h-5 w-5 text-[#3490f3] border-2 border-[#cedbe8] focus:ring-2 focus:ring-[#3490f3] focus:ring-offset-0"
                    checked={initialTeam === 'A'}
                    onChange={() => !gameStarted && setInitialTeam('A')}
                    disabled={gameStarted}
                  />
                  <span className="text-[#0d141c] text-base">设为初始玩家</span>
                </label>
                {/* 占位元素，使输入框长度与团队B一致 */}
                <div className="min-w-[100px]"></div>
              </div>

              {/* 第二行：团队B输入框 | 设为初始玩家 | 开始游戏按钮 */}
              <div className="flex items-center gap-3">
                <input
                  placeholder="团队 B"
                  className="form-input flex min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d141c] focus:outline-0 focus:ring-0 border border-[#cedbe8] bg-slate-50 focus:border-[#cedbe8] h-8 sm:h-10 placeholder:text-[#49719c] p-[8px] sm:p-[10px] text-base font-normal leading-normal"
                  value={teamB.name}
                  onChange={(e) => setTeamB({ ...teamB, name: e.target.value })}
                />
                <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="radio"
                    name="initialTeam"
                    className="h-5 w-5 text-[#3490f3] border-2 border-[#cedbe8] focus:ring-2 focus:ring-[#3490f3] focus:ring-offset-0"
                    checked={initialTeam === 'B'}
                    onChange={() => !gameStarted && setInitialTeam('B')}
                    disabled={gameStarted}
                  />
                  <span className="text-[#0d141c] text-base">设为初始玩家</span>
                </label>
                <button
                  onClick={() => {
                    if (initialTeam) {
                      const now = Date.now();
                      setGameStarted(true);
                      setCurrentTeam(initialTeam);
                      setGameStartTime(now);
                      setShowBattleAnimation(true);
                    }
                  }}
                  disabled={!initialTeam || gameStarted}
                  className={`flex min-w-[100px] items-center justify-center overflow-hidden rounded-full h-8 sm:h-10 px-4 sm:px-6 text-sm sm:text-sm font-bold leading-normal tracking-[0.015em] whitespace-nowrap ${
                    initialTeam && !gameStarted
                      ? 'cursor-pointer bg-[#3490f3] text-slate-50'
                      : 'cursor-not-allowed bg-[#f0f3f8] text-[#8494a5]'
                  }`}
                >
                  <span className="truncate">开始游戏</span>
                </button>
              </div>
            </div>

            <h2 className="text-[#0d141c] text-xl sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-2 sm:px-4 pb-2 pt-4">当前进度</h2>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-2 sm:px-4 py-3 gap-4">
              <div className="flex flex-col items-center">
                <p className="text-[#0d141c] text-sm font-normal leading-normal">当前玩家</p>
                <p className="text-[#0d141c] text-lg sm:text-2xl font-bold leading-normal mt-2">
                  {getCurrentTeamName()}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-[#0d141c] text-sm font-normal leading-normal">当前进度</p>
                <p className="text-[#0d141c] text-[32px] sm:text-[48px] font-bold leading-normal mt-2">
                  {currentTeam ? getDisplayProgress(currentTeam === 'A' ? teamA.progress : teamB.progress) : '-'}
                </p>
              </div>
              <div className="flex flex-col items-center justify-end">
                <button
                  onClick={handleReset}
                  className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 sm:h-10 px-4 bg-[#e7edf4] text-[#0d141c] text-base sm:text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate">重置</span>
                </button>
              </div>
            </div>

            <h2 className="text-[#0d141c] text-xl sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-2 sm:px-4 pb-2 pt-4">玩家记录</h2>
            <div className="flex flex-col md:flex-row md:justify-between px-2 sm:px-4 py-3 gap-4">
              <div className="flex-1 bg-[#f0f3f8] rounded-2xl p-3 sm:p-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[#0d141c] text-base font-bold">{teamA.name || "团队A"}</p>
                  <div className="flex items-center">
                    <span className="text-[#49719c] text-sm mr-2">进度</span>
                    <span className="text-[#0d141c] text-lg sm:text-2xl font-bold">{getDisplayProgress(teamA.progress)}</span>
                  </div>
                </div>
                <div className={`h-1 w-full rounded-full bg-[#e7edf4] overflow-hidden`}>
                  <div 
                    className="h-full bg-[#3490f3] transition-all duration-300" 
                    style={{ 
                      width: `${((getProgressOrder().indexOf(teamA.progress) + 1) / getProgressOrder().length) * 100}%` 
                    }}
                  />
                </div>
              </div>
              <div className="flex-1 bg-[#f0f3f8] rounded-2xl p-3 sm:p-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[#0d141c] text-base font-bold">{teamB.name || "团队B"}</p>
                  <div className="flex items-center">
                    <span className="text-[#49719c] text-sm mr-2">进度</span>
                    <span className="text-[#0d141c] text-lg sm:text-2xl font-bold">{getDisplayProgress(teamB.progress)}</span>
                  </div>
                </div>
                <div className={`h-1 w-full rounded-full bg-[#e7edf4] overflow-hidden`}>
                  <div 
                    className="h-full bg-[#3490f3] transition-all duration-300" 
                    style={{ 
                      width: `${((getProgressOrder().indexOf(teamB.progress) + 1) / getProgressOrder().length) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </div>

            <h2 className="text-[#0d141c] text-xl sm:text-[22px] font-bold leading-tight tracking-[-0.015em] px-2 sm:px-4 pb-2 pt-4">调整进度</h2>
            <div className="flex flex-col lg:flex-row lg:justify-between px-2 sm:px-4 gap-6 sm:gap-8">
              <div className="flex flex-col items-center gap-4 flex-1">
                <h3 className="text-[#0d141c] text-base font-bold">{teamA.name || "团队A"}获胜</h3>
                <button
                  onClick={() => handleProgressUpdate('A', 2)}
                  disabled={!currentTeam || !gameStarted || buttonCooldown}
                  className={`flex w-full sm:min-w-[200px] items-center justify-center overflow-hidden rounded-full h-14 sm:h-10 px-4 sm:px-6 text-base sm:text-sm font-bold leading-normal tracking-[0.015em] ${
                    currentTeam && gameStarted && !buttonCooldown ? 'cursor-pointer bg-[#e7edf4] text-[#0d141c]' : 'cursor-not-allowed bg-[#f0f3f8] text-[#8494a5]'
                  }`}
                >
                  <span className="truncate">{teamA.name || "团队A"}获得第2名</span>
                </button>
                <button
                  onClick={() => handleProgressUpdate('A', 3)}
                  disabled={!currentTeam || !gameStarted || buttonCooldown}
                  className={`flex w-full sm:min-w-[200px] items-center justify-center overflow-hidden rounded-full h-14 sm:h-10 px-4 sm:px-6 text-base sm:text-sm font-bold leading-normal tracking-[0.015em] ${
                    currentTeam && gameStarted && !buttonCooldown ? 'cursor-pointer bg-[#e7edf4] text-[#0d141c]' : 'cursor-not-allowed bg-[#f0f3f8] text-[#8494a5]'
                  }`}
                >
                  <span className="truncate">{teamA.name || "团队A"}获得第3名</span>
                </button>
                <button
                  onClick={() => handleProgressUpdate('A', 4)}
                  disabled={!currentTeam || !gameStarted || buttonCooldown}
                  className={`flex w-full sm:min-w-[200px] items-center justify-center overflow-hidden rounded-full h-14 sm:h-10 px-4 sm:px-6 text-base sm:text-sm font-bold leading-normal tracking-[0.015em] ${
                    currentTeam && gameStarted && !buttonCooldown ? 'cursor-pointer bg-[#e7edf4] text-[#0d141c]' : 'cursor-not-allowed bg-[#f0f3f8] text-[#8494a5]'
                  }`}
                >
                  <span className="truncate">{teamA.name || "团队A"}获得第4名</span>
                </button>
              </div>
              <div className="flex flex-col items-center gap-4 flex-1">
                <h3 className="text-[#0d141c] text-base font-bold">{teamB.name || "团队B"}获胜</h3>
                <button
                  onClick={() => handleProgressUpdate('B', 2)}
                  disabled={!currentTeam || !gameStarted || buttonCooldown}
                  className={`flex w-full sm:min-w-[200px] items-center justify-center overflow-hidden rounded-full h-14 sm:h-10 px-4 sm:px-6 text-base sm:text-sm font-bold leading-normal tracking-[0.015em] ${
                    currentTeam && gameStarted && !buttonCooldown ? 'cursor-pointer bg-[#e7edf4] text-[#0d141c]' : 'cursor-not-allowed bg-[#f0f3f8] text-[#8494a5]'
                  }`}
                >
                  <span className="truncate">{teamB.name || "团队B"}获得第2名</span>
                </button>
                <button
                  onClick={() => handleProgressUpdate('B', 3)}
                  disabled={!currentTeam || !gameStarted || buttonCooldown}
                  className={`flex w-full sm:min-w-[200px] items-center justify-center overflow-hidden rounded-full h-14 sm:h-10 px-4 sm:px-6 text-base sm:text-sm font-bold leading-normal tracking-[0.015em] ${
                    currentTeam && gameStarted && !buttonCooldown ? 'cursor-pointer bg-[#e7edf4] text-[#0d141c]' : 'cursor-not-allowed bg-[#f0f3f8] text-[#8494a5]'
                  }`}
                >
                  <span className="truncate">{teamB.name || "团队B"}获得第3名</span>
                </button>
                <button
                  onClick={() => handleProgressUpdate('B', 4)}
                  disabled={!currentTeam || !gameStarted || buttonCooldown}
                  className={`flex w-full sm:min-w-[200px] items-center justify-center overflow-hidden rounded-full h-14 sm:h-10 px-4 sm:px-6 text-base sm:text-sm font-bold leading-normal tracking-[0.015em] ${
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