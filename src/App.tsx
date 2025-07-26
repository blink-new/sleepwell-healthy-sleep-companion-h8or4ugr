import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Moon, Sun, Sunrise, Sunset, Volume2, Heart, Sparkles, Palette, Settings, Timer } from 'lucide-react';

const SleepWell = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeSound, setActiveSound] = useState(null);
  const [soundTimers, setSoundTimers] = useState({
    rain: 0,
    ocean: 0,
    forest: 0
  });
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [routineItems, setRoutineItems] = useState([
    { id: 1, text: 'Dim the lights', completed: false },
    { id: 2, text: 'Put away devices', completed: false },
    { id: 3, text: 'Gentle stretching', completed: false },
    { id: 4, text: 'Breathing exercise', completed: false },
    { id: 5, text: 'Read or meditate', completed: false }
  ]);
  const [selectedBackground, setSelectedBackground] = useState('aurora');
  const [showCustomizer, setShowCustomizer] = useState(false);
  
  const timerRefs = useRef({});

  // Time-based background themes
  const getTimeOfDay = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  };

  const backgroundThemes = {
    morning: {
      gradient: 'from-emerald-400 via-cyan-300 to-blue-400',
      icon: Sunrise,
      name: 'Morning Glow'
    },
    afternoon: {
      gradient: 'from-blue-400 via-cyan-300 to-emerald-400',
      icon: Sun,
      name: 'Afternoon Sky'
    },
    evening: {
      gradient: 'from-orange-400 via-rose-400 to-violet-500',
      icon: Sunset,
      name: 'Evening Sunset'
    },
    night: {
      gradient: 'from-violet-600 via-blue-600 to-emerald-500',
      icon: Moon,
      name: 'Night Dreams'
    },
    aurora: {
      gradient: 'from-emerald-400 via-cyan-400 to-violet-500',
      icon: Sparkles,
      name: 'Aurora Borealis'
    },
    ocean: {
      gradient: 'from-blue-600 via-cyan-500 to-emerald-400',
      icon: Heart,
      name: 'Ocean Depths'
    },
    forest: {
      gradient: 'from-emerald-600 via-green-500 to-cyan-400',
      icon: Heart,
      name: 'Forest Whisper'
    }
  };

  const currentTheme = backgroundThemes[selectedBackground] || backgroundThemes[getTimeOfDay()];

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sound timer management
  useEffect(() => {
    const timers = timerRefs.current;
    
    Object.keys(soundTimers).forEach(sound => {
      if (soundTimers[sound] > 0 && activeSound === sound) {
        if (!timers[sound]) {
          timers[sound] = setInterval(() => {
            setSoundTimers(prev => ({
              ...prev,
              [sound]: Math.max(0, prev[sound] - 1)
            }));
          }, 1000);
        }
      } else {
        if (timers[sound]) {
          clearInterval(timers[sound]);
          timers[sound] = null;
        }
      }
    });

    return () => {
      Object.values(timers).forEach(timer => {
        if (timer) clearInterval(timer);
      });
    };
  }, [soundTimers, activeSound]);

  // Breathing exercise
  useEffect(() => {
    if (isBreathing) {
      const breathingCycle = setInterval(() => {
        setBreathingPhase(prev => {
          if (prev === 'inhale') return 'hold';
          if (prev === 'hold') return 'exhale';
          return 'inhale';
        });
      }, 4000);
      return () => clearInterval(breathingCycle);
    }
  }, [isBreathing]);

  const sounds = [
    { id: 'rain', name: 'Rain', icon: '🌧️', color: 'from-blue-400 to-cyan-400' },
    { id: 'ocean', name: 'Ocean Waves', icon: '🌊', color: 'from-cyan-400 to-emerald-400' },
    { id: 'forest', name: 'Forest', icon: '🌲', color: 'from-emerald-400 to-green-400' }
  ];

  const sleepTips = [
    { category: 'Routine', tip: 'Go to bed at the same time every night', icon: '⏰' },
    { category: 'Environment', tip: 'Keep your bedroom cool and dark', icon: '🌙' },
    { category: 'Health', tip: 'Avoid caffeine 6 hours before bedtime', icon: '☕' },
    { category: 'Relaxation', tip: 'Practice deep breathing before sleep', icon: '🧘' },
    { category: 'Technology', tip: 'Turn off screens 1 hour before bed', icon: '📱' },
    { category: 'Comfort', tip: 'Invest in a comfortable mattress', icon: '🛏️' }
  ];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleSound = (soundId) => {
    if (activeSound === soundId) {
      setActiveSound(null);
    } else {
      setActiveSound(soundId);
      if (soundTimers[soundId] === 0) {
        setSoundTimers(prev => ({ ...prev, [soundId]: 600 })); // 10 minutes default
      }
    }
  };

  const resetTimer = (soundId) => {
    setSoundTimers(prev => ({ ...prev, [soundId]: 600 }));
  };

  const toggleRoutineItem = (id) => {
    setRoutineItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl floating"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full blur-2xl floating" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-white rounded-full blur-3xl floating" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 gradient-text">SleepWell</h1>
            <p className="text-white/70">Your healthy sleep companion</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="glass-card px-4 py-2">
              <div className="flex items-center gap-2 text-white">
                <currentTheme.icon className="w-5 h-5" />
                <span className="font-medium">{currentTime.toLocaleTimeString()}</span>
              </div>
            </div>
            <button 
              onClick={() => setShowCustomizer(!showCustomizer)}
              className="glass-card p-3 text-white hover:bg-white/10 transition-all duration-300"
            >
              <Palette className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Background Customizer */}
        {showCustomizer && (
          <div className="glass-card p-6 mb-8 animate-in slide-in-from-top duration-300">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Choose Your Mood
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(backgroundThemes).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => setSelectedBackground(key)}
                  className={`p-4 rounded-xl bg-gradient-to-br ${theme.gradient} relative overflow-hidden transition-all duration-300 ${
                    selectedBackground === key ? 'ring-2 ring-white scale-105' : 'hover:scale-102'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2 text-white">
                    <theme.icon className="w-6 h-6" />
                    <span className="text-sm font-medium">{theme.name}</span>
                  </div>
                  {selectedBackground === key && (
                    <div className="absolute inset-0 bg-white/20 rounded-xl"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sound Timers */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <Volume2 className="w-6 h-6" />
                Ambient Sounds
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sounds.map((sound) => (
                  <div key={sound.id} className="glass-card p-4 hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{sound.icon}</span>
                        <span className="text-white font-medium">{sound.name}</span>
                      </div>
                      <button
                        onClick={() => resetTimer(sound.id)}
                        className="text-white/60 hover:text-white transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white/80 font-mono text-lg">
                        {formatTime(soundTimers[sound.id])}
                      </span>
                      <button
                        onClick={() => toggleSound(sound.id)}
                        className={`p-2 rounded-full transition-all duration-300 ${
                          activeSound === sound.id 
                            ? 'bg-emerald-500 text-white pulse-glow' 
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        {activeSound === sound.id ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </button>
                    </div>
                    
                    {activeSound === sound.id && (
                      <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${sound.color} transition-all duration-1000 shimmer`}
                          style={{ width: `${(soundTimers[sound.id] / 600) * 100}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Breathing Exercise */}
            <div className="glass-card p-6 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <Heart className="w-6 h-6" />
                Guided Breathing
              </h2>
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div 
                    className={`w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center transition-all duration-1000 ${
                      isBreathing ? 'breathing-circle' : ''
                    }`}
                  >
                    <span className="text-white font-semibold text-lg">
                      {isBreathing ? breathingPhase.toUpperCase() : 'READY'}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsBreathing(!isBreathing)}
                  className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                    isBreathing 
                      ? 'bg-rose-500 text-white hover:bg-rose-600' 
                      : 'bg-emerald-500 text-white hover:bg-emerald-600 pulse-glow'
                  }`}
                >
                  {isBreathing ? 'Stop Breathing' : 'Start Breathing'}
                </button>
                
                {isBreathing && (
                  <p className="text-white/80 mt-4 text-center">
                    Follow the circle: Inhale for 4s, Hold for 4s, Exhale for 4s
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Night Routine */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Moon className="w-5 h-5" />
                Night Routine
              </h3>
              <div className="space-y-3">
                {routineItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <button
                      onClick={() => toggleRoutineItem(item.id)}
                      className={`w-5 h-5 rounded border-2 transition-all duration-300 ${
                        item.completed 
                          ? 'bg-emerald-500 border-emerald-500' 
                          : 'border-white/40 hover:border-white/60'
                      }`}
                    >
                      {item.completed && <span className="text-white text-xs">✓</span>}
                    </button>
                    <span className={`text-white transition-all duration-300 ${
                      item.completed ? 'line-through opacity-60' : ''
                    }`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex justify-between text-sm text-white/80">
                  <span>Progress</span>
                  <span>{routineItems.filter(item => item.completed).length}/{routineItems.length}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${(routineItems.filter(item => item.completed).length / routineItems.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Sleep Tips */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Sleep Tips
              </h3>
              <div className="space-y-4">
                {sleepTips.slice(0, 3).map((tip, index) => (
                  <div key={index} className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <span className="text-lg">{tip.icon}</span>
                      <div>
                        <span className="text-xs text-emerald-300 font-medium">{tip.category}</span>
                        <p className="text-white/90 text-sm mt-1">{tip.tip}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepWell;