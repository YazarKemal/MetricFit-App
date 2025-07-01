import React, { useState, useEffect } from 'react';
import { User, Calendar, TrendingUp, Settings, Plus, Clock, Target, Zap } from 'lucide-react';

const MetricFit = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [workoutRecords, setWorkoutRecords] = useState([]);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showAICoach, setShowAICoach] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiRecommendation, setAIRecommendation] = useState(null);
  const [userMood, setUserMood] = useState('');
  const [userEnergy, setUserEnergy] = useState('');
  const [availableTime, setAvailableTime] = useState('');
  const [userProfile, setUserProfile] = useState({
    name: 'Ahmet Yılmaz',
    age: 28,
    weight: 75.2,
    height: 175,
    targetWeight: 72,
    fitnessLevel: 'Orta',
    goals: ['Kilo Verme', 'Kas Kütlesi Artırma', 'Dayanıklılık']
  });
  const [editProfile, setEditProfile] = useState({...userProfile});
  const [newRecord, setNewRecord] = useState({
    exercise: '',
    weight: '',
    reps: '',
    sets: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setWorkoutTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTodayCalories = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = workoutRecords.filter(record => record.date === today);
    return todayRecords.reduce((total, record) => total + (record.sets * record.reps * 0.8), 0);
  };

  const getTodayActiveTime = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = workoutRecords.filter(record => record.date === today);
    const totalMinutes = todayRecords.reduce((total, record) => total + (record.sets * 3), 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours > 0 ? `${hours}sa ${minutes}dk` : `${minutes}dk`;
  };

  const getTodayActiveMinutes = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = workoutRecords.filter(record => record.date === today);
    return todayRecords.reduce((total, record) => total + (record.sets * 3), 0);
  };

  const addWorkoutRecord = () => {
    if (newRecord.exercise && newRecord.weight && newRecord.reps && newRecord.sets) {
      const record = {
        ...newRecord,
        id: Date.now(),
        weight: parseFloat(newRecord.weight),
        reps: parseInt(newRecord.reps),
        sets: parseInt(newRecord.sets)
      };
      setWorkoutRecords([...workoutRecords, record]);
      setNewRecord({
        exercise: '',
        weight: '',
        reps: '',
        sets: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowAddRecord(false);
    }
  };

  const saveProfile = () => {
    setUserProfile({...editProfile});
    setShowProfileEdit(false);
  };

  const getExerciseProgress = (exerciseName) => {
    const exerciseRecords = workoutRecords.filter(record => 
      record.exercise.toLowerCase().includes(exerciseName.toLowerCase())
    );
    if (exerciseRecords.length === 0) return { current: '0kg', progress: 0 };
    
    const maxWeight = Math.max(...exerciseRecords.map(r => r.weight));
    return { current: `${maxWeight}kg`, progress: Math.min((maxWeight / 120) * 100, 100) };
  };

  const getTotalWorkouts = () => {
    const uniqueDates = new Set(workoutRecords.map(r => r.date));
    return uniqueDates.size;
  };

  const getWeeklyStats = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyRecords = workoutRecords.filter(record => 
      new Date(record.date) >= oneWeekAgo
    );
    
    const uniqueDates = new Set(weeklyRecords.map(r => r.date));
    const totalSets = weeklyRecords.reduce((sum, r) => sum + r.sets, 0);
    
    return {
      workouts: uniqueDates.size,
      totalSets: totalSets,
      avgDuration: uniqueDates.size > 0 ? Math.round(totalSets * 3) : 0
    };
  };

  const themeClasses = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    text: isDarkMode ? 'text-white' : 'text-gray-800',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    inputBg: isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
  };

  const progressData = [
    { exercise: 'Bench Press', target: '90kg', ...getExerciseProgress('bench') },
    { exercise: 'Squat', target: '120kg', ...getExerciseProgress('squat') },
    { exercise: 'Deadlift', target: '140kg', ...getExerciseProgress('deadlift') }
  ];

  const generateAIRecommendation = () => {
    setIsAnalyzing(true);
    setAIRecommendation(null);
    
    setTimeout(() => {
      const workoutScenarios = [
        {
          type: "Güç Antrenmanı",
          duration: "45-60 dk",
          exercises: ["Squat", "Deadlift", "Bench Press", "Overhead Press"],
          mood: ["motivated", "energetic"],
          energy: ["high"],
          supplements: ["Creatine", "Whey Protein", "BCAA"]
        },
        {
          type: "Hafif Cardio & Streching",
          duration: "20-30 dk", 
          exercises: ["Yürüyüş", "Hafif Jogging", "Yoga", "Stretching"],
          mood: ["tired", "stressed"],
          energy: ["low"],
          supplements: ["Magnesium", "Omega-3", "Multivitamin"]
        },
        {
          type: "HIIT Antrenmanı",
          duration: "25-35 dk",
          exercises: ["Burpees", "Mountain Climbers", "Jump Squats", "Push-ups"],
          mood: ["motivated", "energetic"],
          energy: ["medium", "high"],
          supplements: ["Beta-Alanine", "Caffeine", "Whey Protein"]
        },
        {
          type: "Recovery Day",
          duration: "15-25 dk",
          exercises: ["Foam Rolling", "Light Stretching", "Sauna", "Massage"],
          mood: ["tired", "sore"],
          energy: ["low"],
          supplements: ["Magnesium", "Turmeric", "Omega-3"]
        }
      ];

      const supplementDatabase = {
        "Creatine": {
          benefit: "Güç ve performans artışı",
          timing: "Antrenman öncesi/sonrası",
          dosage: "3-5g günlük"
        },
        "Whey Protein": {
          benefit: "Kas onarımı ve gelişimi",
          timing: "Antrenman sonrası 30 dk içinde",
          dosage: "25-30g"
        },
        "BCAA": {
          benefit: "Kas korunması ve toparlanma",
          timing: "Antrenman sırasında",
          dosage: "10-15g"
        },
        "Beta-Alanine": {
          benefit: "Dayanıklılık artışı",
          timing: "Antrenman öncesi 20-30 dk",
          dosage: "3-5g"
        },
        "Magnesium": {
          benefit: "Kas gevşemesi ve uyku kalitesi",
          timing: "Yatmadan önce",
          dosage: "200-400mg"
        },
        "Omega-3": {
          benefit: "Anti-inflamatuar, kalp sağlığı",
          timing: "Yemekle birlikte",
          dosage: "1-2g EPA/DHA"
        },
        "Caffeine": {
          benefit: "Enerji ve odaklanma",
          timing: "Antrenman öncesi 30 dk",
          dosage: "100-200mg"
        },
        "Turmeric": {
          benefit: "Anti-inflamatuar, eklem sağlığı",
          timing: "Yemekle birlikte",
          dosage: "500-1000mg"
        },
        "Multivitamin": {
          benefit: "Genel sağlık desteği",
          timing: "Sabah yemekle",
          dosage: "1 tablet"
        }
      };

      let recommendedWorkout = workoutScenarios.find(w => 
        w.mood.includes(userMood) && w.energy.includes(userEnergy)
      );
      
      if (!recommendedWorkout) {
        if (userEnergy === 'low') {
          recommendedWorkout = workoutScenarios[1];
        } else if (userEnergy === 'high') {
          recommendedWorkout = workoutScenarios[0];
        } else {
          recommendedWorkout = workoutScenarios[2];
        }
      }

      const selectedSupplements = recommendedWorkout.supplements.map(sup => ({
        name: sup,
        ...supplementDatabase[sup]
      }));

      const generatePersonalizedNote = () => {
        const notes = {
          'tired-low': "Bugün yorgunsun, vücudunu zorlama. Hafif hareket ve iyi beslenme odaklan. 🌱",
          'stressed-low': "Stres seviyende yüksek. Nefes egzersizleri ve hafif hareket seni rahatlatsın. 🧘‍♂️",
          'motivated-high': "Harika enerji seviyende! Bu motivasyonu güçlü bir antrenmana dönüştür. 🔥",
          'energetic-high': "Enerji dolu! Yoğun antrenman için mükemmel bir gün. Limitlerinizi zorlayın! ⚡",
          'neutral-medium': "Dengeli bir gün. Orta yoğunlukta antrenman ve düzenli beslenme odaklan. ⚖️"
        };
        
        return notes[`${userMood}-${userEnergy}`] || "Bugün vücudunuzu dinleyin ve uygun yoğunlukta hareket edin. 💪";
      };

      setAIRecommendation({
        workout: recommendedWorkout,
        supplements: selectedSupplements,
        personalizedNote: generatePersonalizedNote()
      });
      
      setIsAnalyzing(false);
    }, 2500);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-2">Merhaba, {userProfile.name}!</h2>
        <p className="text-blue-100">Bugün hedeflerine bir adım daha yaklaş</p>
        <div className="mt-4 flex items-center space-x-4">
          <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
            🔥 {getTotalWorkouts()} toplam antrenman
          </div>
          <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
            💪 Bu hafta {getWeeklyStats().workouts}/7 gün
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={`${themeClasses.cardBg} p-4 rounded-lg ${themeClasses.border} border shadow-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${themeClasses.textSecondary} text-sm`}>Bugün Kalori</p>
              <p className="text-2xl font-bold text-green-600">{Math.round(getTodayCalories())}</p>
            </div>
            <Target className="text-green-500" size={24} />
          </div>
          <div className={`mt-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
            <div className="bg-green-500 h-2 rounded-full" style={{width: `${Math.min((getTodayCalories() / 2200) * 100, 100)}%`}}></div>
          </div>
        </div>
        
        <div className={`${themeClasses.cardBg} p-4 rounded-lg ${themeClasses.border} border shadow-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${themeClasses.textSecondary} text-sm`}>Aktif Süre</p>
              <p className="text-2xl font-bold text-orange-600">{getTodayActiveTime()}</p>
            </div>
            <Clock className="text-orange-500" size={24} />
          </div>
          <div className={`mt-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
            <div className="bg-orange-500 h-2 rounded-full" style={{width: `${Math.min((getTodayActiveMinutes() / 120) * 100, 100)}%`}}></div>
          </div>
        </div>
      </div>

      <div className={`${themeClasses.cardBg} p-6 rounded-xl ${themeClasses.border} border shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${themeClasses.text}`}>Bugünün Antrenmanı</h3>
          <button className="text-blue-600 text-sm font-medium">Tümünü Gör</button>
        </div>
        
        <div className={`${isDarkMode ? 'bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-700' : 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200'} p-4 rounded-lg border`}>
          <div className="flex items-center justify-between">
            <div>
              <h4 className={`font-semibold ${themeClasses.text}`}>Göğüs & Triceps</h4>
              <p className={`${themeClasses.textSecondary} text-sm`}>8 egzersiz • 45 dakika</p>
              <p className="text-purple-600 text-sm font-medium mt-1">Orta seviye</p>
            </div>
            <button 
              onClick={() => setActiveTab('workout')}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Başla
            </button>
          </div>
        </div>
      </div>

      <div className={`${themeClasses.cardBg} p-6 rounded-xl ${themeClasses.border} border shadow-sm`}>
        <h3 className={`text-lg font-semibold mb-4 ${themeClasses.text}`}>İlerleme Özeti</h3>
        <div className="space-y-3">
          {progressData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-medium ${themeClasses.text}`}>{item.exercise}</span>
                  <span className={`text-sm ${themeClasses.textSecondary}`}>{item.current} / {item.target}</span>
                </div>
                <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                    style={{width: `${item.progress}%`}}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWorkout = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Antrenman Süren</h3>
            <p className="text-3xl font-mono mt-2">{formatTime(workoutTimer)}</p>
          </div>
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className={`p-4 rounded-full ${isTimerRunning ? 'bg-red-500' : 'bg-green-500'} hover:opacity-80 transition-opacity`}
          >
            {isTimerRunning ? '⏸️' : '▶️'}
          </button>
        </div>
      </div>

      <div className={`${themeClasses.cardBg} p-6 rounded-xl ${themeClasses.border} border shadow-sm`}>
        <div className="text-center">
          <div className="mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🧠</span>
            </div>
            <h3 className={`text-xl font-bold mb-2 ${themeClasses.text}`}>AI Smart Coach</h3>
            <p className={`text-sm ${themeClasses.textSecondary} mb-4`}>Ruh halinize ve enerji seviyenize özel antrenman & supplement önerisi</p>
          </div>
          
          <button 
            onClick={() => setShowAICoach(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 flex items-center space-x-3 mx-auto shadow-lg"
          >
            <span className="text-2xl">✨</span>
            <span>Bugünkü Önerim Nedir?</span>
          </button>
          
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className={`p-3 ${isDarkMode ? 'bg-purple-900/30' : 'bg-purple-50'} rounded-lg border ${isDarkMode ? 'border-purple-700' : 'border-purple-200'}`}>
              <p className={`text-xs ${themeClasses.textSecondary} mb-1`}>🎯 Özelleştirilebilir</p>
              <p className={`text-sm font-bold ${themeClasses.text}`}>10+ Antrenman</p>
            </div>
            <div className={`p-3 ${isDarkMode ? 'bg-pink-900/30' : 'bg-pink-50'} rounded-lg border ${isDarkMode ? 'border-pink-700' : 'border-pink-200'}`}>
              <p className={`text-xs ${themeClasses.textSecondary} mb-1`}>💊 Akıllı Tavsiye</p>
              <p className={`text-sm font-bold ${themeClasses.text}`}>15+ Supplement</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`${themeClasses.cardBg} p-6 rounded-xl ${themeClasses.border} border shadow-sm`}>
        <div className="text-center">
          <h3 className={`text-lg font-semibold mb-4 ${themeClasses.text}`}>Antrenman Kaydı</h3>
          <button 
            onClick={() => setShowAddRecord(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
          >
            <Plus size={20} />
            <span>Yeni Kayıt Ekle</span>
          </button>
          <p className={`text-sm ${themeClasses.textSecondary} mt-2`}>Antrenmanınızı kaydedin ve ilerlemenizi takip edin</p>
        </div>
      </div>

      {/* AI Modal */}
      {showAICoach && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className={`${themeClasses.cardBg} rounded-xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto`}>
            <div className="text-center">
              <h3 className={`text-lg font-semibold mb-4 ${themeClasses.text}`}>🧠 AI Smart Coach</h3>
              
              {!isAnalyzing && !aiRecommendation && (
                <div className="space-y-4">
                  <div className="space-y-3 text-left">
                    <div>
                      <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>Bugün nasıl hissediyorsun? 🎭</label>
                      <select
                        value={userMood}
                        onChange={(e) => setUserMood(e.target.value)}
                        className={`w-full p-3 rounded-lg ${themeClasses.inputBg} ${themeClasses.text} ${themeClasses.border} border`}
                      >
                        <option value="">Ruh halini seç</option>
                        <option value="energetic">⚡ Enerjik</option>
                        <option value="motivated">🔥 Motive</option>
                        <option value="neutral">😌 Normal</option>
                        <option value="tired">😴 Yorgun</option>
                        <option value="stressed">😰 Stresli</option>
                        <option value="sore">🤕 Kaslar ağrıyor</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>Enerji seviyeN? ⚡</label>
                      <select
                        value={userEnergy}
                        onChange={(e) => setUserEnergy(e.target.value)}
                        className={`w-full p-3 rounded-lg ${themeClasses.inputBg} ${themeClasses.text} ${themeClasses.border} border`}
                      >
                        <option value="">Enerji seviyeni seç</option>
                        <option value="high">🚀 Yüksek</option>
                        <option value="medium">⚖️ Orta</option>
                        <option value="low">🔋 Düşük</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>Ne kadar vaktın var? ⏰</label>
                      <select
                        value={availableTime}
                        onChange={(e) => setAvailableTime(e.target.value)}
                        className={`w-full p-3 rounded-lg ${themeClasses.inputBg} ${themeClasses.text} ${themeClasses.border} border`}
                      >
                        <option value="">Süre seç</option>
                        <option value="15-30">⏱️ 15-30 dk</option>
                        <option value="30-45">🕐 30-45 dk</option>
                        <option value="45-60">🕑 45-60 dk</option>
                        <option value="60+">🕰️ 60+ dk</option>
                      </select>
                    </div>
                  </div>
                  
                  <button
                    onClick={generateAIRecommendation}
                    disabled={!userMood || !userEnergy || !availableTime}
                    className={`w-full py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 ${
                      userMood && userEnergy && availableTime
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                        : `${themeClasses.inputBg} ${themeClasses.textSecondary} cursor-not-allowed`
                    }`}
                  >
                    ✨ AI Önerimi Oluştur
                  </button>
                </div>
              )}

              {isAnalyzing && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="animate-pulse text-5xl mb-3">🧠</div>
                    <p className={`text-lg font-bold ${themeClasses.text} mb-1`}>AI Senin İçin Düşünüyor...</p>
                    <p className={`text-sm ${themeClasses.textSecondary}`}>Özel programın hazırlanıyor</p>
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
                  </div>
                </div>
              )}

              {aiRecommendation && (
                <div className="space-y-4 text-left">
                  <div className="text-center mb-4">
                    <h4 className={`text-xl font-bold ${themeClasses.text}`}>Senin İçin Özel Öneri 🎯</h4>
                  </div>

                  <div className={`p-4 ${isDarkMode ? 'bg-purple-900/30' : 'bg-purple-50'} rounded-lg border ${isDarkMode ? 'border-purple-700' : 'border-purple-200'}`}>
                    <p className={`text-sm ${themeClasses.text} font-medium mb-1`}>💡 Kemal'den Özel Not:</p>
                    <p className={`text-sm ${themeClasses.textSecondary}`}>{aiRecommendation.personalizedNote}</p>
                  </div>

                  <div className={`p-4 ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'} rounded-lg border ${isDarkMode ? 'border-blue-700' : 'border-blue-200'}`}>
                    <h5 className={`font-bold ${themeClasses.text} mb-2`}>🏋️‍♂️ Önerilen Antrenman:</h5>
                    <p className={`text-lg font-semibold ${themeClasses.text}`}>{aiRecommendation.workout.type}</p>
                    <p className={`text-sm ${themeClasses.textSecondary} mb-2`}>⏱️ Süre: {aiRecommendation.workout.duration}</p>
                    <div className="space-y-1">
                      <p className={`text-sm font-medium ${themeClasses.text}`}>Egzersizler:</p>
                      {aiRecommendation.workout.exercises.map((exercise, idx) => (
                        <span key={idx} className={`inline-block px-2 py-1 mr-1 mb-1 text-xs rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                          {exercise}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={`p-4 ${isDarkMode ? 'bg-green-900/30' : 'bg-green-50'} rounded-lg border ${isDarkMode ? 'border-green-700' : 'border-green-200'}`}>
                    <h5 className={`font-bold ${themeClasses.text} mb-3`}>💊 Önerilen Supplementler:</h5>
                    <div className="space-y-3">
                      {aiRecommendation.supplements.map((supplement, idx) => (
                        <div key={idx} className="border-l-4 border-green-500 pl-3">
                          <p className={`font-semibold ${themeClasses.text}`}>{supplement.name}</p>
                          <p className={`text-xs ${themeClasses.textSecondary}`}>
                            <span className="font-medium">Fayda:</span> {supplement.benefit}
                          </p>
                          <p className={`text-xs ${themeClasses.textSecondary}`}>
                            <span className="font-medium">Zamanlama:</span> {supplement.timing}
                          </p>
                          <p className={`text-xs ${themeClasses.textSecondary}`}>
                            <span className="font-medium">Doz:</span> {supplement.dosage}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setAIRecommendation(null);
                      setUserMood('');
                      setUserEnergy('');
                      setAvailableTime('');
                    }}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    🔄 Yeni Öneri Al
                  </button>
                </div>
              )}

              <button
                onClick={() => {
                  setShowAICoach(false);
                  setAIRecommendation(null);
                  setUserMood('');
                  setUserEnergy('');
                  setAvailableTime('');
                  setIsAnalyzing(false);
                }}
                className={`w-full mt-4 px-4 py-2 rounded-lg ${themeClasses.inputBg} ${themeClasses.text} font-medium`}
              >
                ❌ Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Record Modal */}
      {showAddRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${themeClasses.cardBg} rounded-xl p-6 w-full max-w-sm`}>
            <h3 className={`text-lg font-semibold mb-4 ${themeClasses.text}`}>Antrenman Kaydı Ekle</h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${themeClasses.text} mb-1`}>Egzersiz</label>
                <select
                  value={newRecord.exercise}
                  onChange={(e) => setNewRecord({...newRecord, exercise: e.target.value})}
                  className={`w-full p-2 rounded-lg ${themeClasses.inputBg} ${themeClasses.text} ${themeClasses.border} border`}
                >
                  <option value="">Egzersiz Seçin</option>
                  <option value="Bench Press">Bench Press</option>
                  <option value="Squat">Squat</option>
                  <option value="Deadlift">Deadlift</option>
                  <option value="Shoulder Press">Shoulder Press</option>
                  <option value="Barbell Row">Barbell Row</option>
                  <option value="Pull Up">Pull Up</option>
                  <option value="Dips">Dips</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text} mb-1`}>Ağırlık (kg)</label>
                  <input
                    type="number"
                    value={newRecord.weight}
                    onChange={(e) => setNewRecord({...newRecord, weight: e.target.value})}
                    className={`w-full p-2 rounded-lg ${themeClasses.inputBg} ${themeClasses.text} ${themeClasses.border} border`}
                    placeholder="80"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text} mb-1`}>Set</label>
                  <input
                    type="number"
                    value={newRecord.sets}
                    onChange={(e) => setNewRecord({...newRecord, sets: e.target.value})}
                    className={`w-full p-2 rounded-lg ${themeClasses.inputBg} ${themeClasses.text} ${themeClasses.border} border`}
                    placeholder="3"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text} mb-1`}>Tekrar</label>
                  <input
                    type="number"
                    value={newRecord.reps}
                    onChange={(e) => setNewRecord({...newRecord, reps: e.target.value})}
                    className={`w-full p-2 rounded-lg ${themeClasses.inputBg} ${themeClasses.text} ${themeClasses.border} border`}
                    placeholder="12"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeClasses.text} mb-1`}>Tarih</label>
                <input
                  type="date"
                  value={newRecord.date}
                  onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                  className={`w-full p-2 rounded-lg ${themeClasses.inputBg} ${themeClasses.text} ${themeClasses.border} border`}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddRecord(false)}
                className={`flex-1 px-4 py-2 rounded-lg ${themeClasses.inputBg} ${themeClasses.text} font-medium`}
              >
                İptal
              </button>
              <button
                onClick={addWorkoutRecord}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Records */}
      {workoutRecords.length > 0 && (
        <div className={`${themeClasses.cardBg} p-6 rounded-xl ${themeClasses.border} border shadow-sm`}>
          <h3 className={`text-lg font-semibold mb-4 ${themeClasses.text}`}>Son Kayıtlar</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {workoutRecords.slice(-5).reverse().map((record) => (
              <div key={record.id} className={`p-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className={`font-medium ${themeClasses.text}`}>{record.exercise}</h4>
                    <p className={`text-sm ${themeClasses.textSecondary}`}>
                      {record.weight}kg × {record.reps} tekrar × {record.sets} set
                    </p>
                  </div>
                  <span className={`text-xs ${themeClasses.textSecondary}`}>
                    {new Date(record.date).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderProgress = () => (
    <div className="space-y-6">
      <div className={`${themeClasses.cardBg} p-6 rounded-xl ${themeClasses.border} border shadow-sm`}>
        <h3 className={`text-lg font-semibold mb-4 ${themeClasses.text}`}>Kilo Takibi</h3>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className={`text-3xl font-bold ${themeClasses.text}`}>{userProfile.weight} kg</p>
            <p className="text-green-600 text-sm">Bu hafta -0.3kg</p>
          </div>
          <div className="text-right">
            <p className={`${themeClasses.textSecondary}`}>Hedef</p>
            <p className={`text-xl font-semibold ${themeClasses.text}`}>{userProfile.targetWeight} kg</p>
          </div>
        </div>
        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3`}>
          <div className="bg-blue-500 h-3 rounded-full" style={{width: '68%'}}></div>
        </div>
        <p className={`text-center text-sm ${themeClasses.textSecondary} mt-2`}>68% tamamlandı</p>
      </div>

      <div className={`${themeClasses.cardBg} p-6 rounded-xl ${themeClasses.border} border shadow-sm`}>
        <h3 className={`text-lg font-semibold mb-4 ${themeClasses.text}`}>Kuvvet Gelişimi</h3>
        <div className="space-y-4">
          {progressData.map((item, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className={`font-medium ${themeClasses.text}`}>{item.exercise}</h4>
                <span className="text-blue-600 font-semibold">{item.current}</span>
              </div>
              <div className={`flex justify-between text-sm ${themeClasses.textSecondary} mb-1`}>
                <span>Başlangıç: 60kg</span>
                <span>Hedef: {item.target}</span>
              </div>
              <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
                  style={{width: `${item.progress}%`}}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`${themeClasses.cardBg} p-6 rounded-xl ${themeClasses.border} border shadow-sm`}>
        <h3 className={`text-lg font-semibold mb-4 ${themeClasses.text}`}>Haftalık İstatistikler</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-purple-600">{getWeeklyStats().workouts}</p>
            <p className={`text-sm ${themeClasses.textSecondary}`}>Antrenman</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600">{getWeeklyStats().avgDuration}</p>
            <p className={`text-sm ${themeClasses.textSecondary}`}>Dakika</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">{getWeeklyStats().totalSets}</p>
            <p className={`text-sm ${themeClasses.textSecondary}`}>Toplam Set</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold">{userProfile.name}</h2>
              <p className="text-purple-100">Fitness Seviyesi: {userProfile.fitnessLevel}</p>
              <p className="text-purple-100">Üyelik: Basic</p>
              <p className="text-purple-100 text-sm opacity-80">Premium yakında gelecek! 🚀</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setEditProfile({...userProfile});
              setShowProfileEdit(true);
            }}
            className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className={`${themeClasses.cardBg} p-6 rounded-xl ${themeClasses.border} border shadow-sm`}>
        <h3 className={`text-lg font-semibold mb-4 ${themeClasses.text}`}>Kişisel Bilgiler</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className={`text-2xl font-bold ${themeClasses.text}`}>{userProfile.age}</p>
            <p className={`text-sm ${themeClasses.textSecondary}`}>Yaş</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${themeClasses.text}`}>{userProfile.height}cm</p>
            <p className={`text-sm ${themeClasses.textSecondary}`}>Boy</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${themeClasses.text}`}>{userProfile.weight}kg</p>
            <p className={`text-sm ${themeClasses.textSecondary}`}>Kilo</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${themeClasses.text}`}>{(userProfile.weight / ((userProfile.height/100) ** 2)).toFixed(1)}</p>
            <p className={`text-sm ${themeClasses.textSecondary}`}>BMI</p>
          </div>
        </div>
      </div>

      <div className={`${themeClasses.cardBg} p-6 rounded-xl ${themeClasses.border} border shadow-sm`}>
        <h3 className={`text-lg font-semibold mb-4 ${themeClasses.text}`}>Hedeflerim</h3>
        <div className="space-y-3">
          {userProfile.goals.map((goal, index) => (
            <div key={index} className={`flex items-center justify-between p-3 ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'} rounded-lg`}>
              <span className={themeClasses.text}>{goal}</span>
              <span className="text-blue-600 font-semibold">{Math.min(getTotalWorkouts() * 15 + (index * 10), 100)}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className={`${themeClasses.cardBg} p-6 rounded-xl ${themeClasses.border} border shadow-sm`}>
        <h3 className={`text-lg font-semibold mb-4 ${themeClasses.text}`}>Ayarlar</h3>
        <div className="space-y-3">
          <div className={`flex items-center justify-between py-2 border-b ${themeClasses.border}`}>
            <span className={themeClasses.text}>Profil Düzenle</span>
            <button 
              onClick={() => {
                setEditProfile({...userProfile});
                setShowProfileEdit(true);
              }}
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              Düzenle
            </button>
          </div>
          <div className={`flex items-center justify-between py-2 border-b ${themeClasses.border}`}>
            <span className={themeClasses.text}>Karanlık Mod</span>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-12 h-6 rounded-full relative transition-colors ${isDarkMode ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${isDarkMode ? 'right-0.5' : 'left-0.5'}`}></div>
            </button>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className={themeClasses.text}>Otomatik Senkronizasyon</span>
            <button className="w-12 h-6 bg-blue-600 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
            </button>
          </div>
        </div>
      </div>

      <div className={`${themeClasses.cardBg} p-4 rounded-xl ${themeClasses.border} border shadow-sm`}>
        <div className="text-center">
          <h4 className={`font-semibold ${themeClasses.text} mb-2`}>Uygulama Hakkında</h4>
          <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
            v1.0.0 Beta
          </span>
        </div>
      </div>

      {showProfileEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${themeClasses.cardBg} rounded-xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto`}>
            <h3 className={`text-lg font-semibold mb-4 ${themeClasses.text}`}>Profil Düzenle</h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${themeClasses.text} mb-1`}>İsim</label>
                <input
                  type="text"
                  value={editProfile.name}
                  onChange={(e) => setEditProfile({...editProfile, name: e.target.value})}
                  className={`w-full p-2 rounded-lg ${themeClasses.inputBg} ${themeClasses.text} ${themeClasses.border} border`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text} mb-1`}>Yaş</label>
                  <input
                    type="number"
                    value={editProfile.age}
                    onChange={(e) => setEditProfile({...editProfile, age: parseInt(e.target.value)})}
                    className={`w-full p-2 rounded-lg ${themeClasses.inputBg} ${themeClasses.text} ${themeClasses.border} border`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text} mb-1`}>Boy (cm)</label>
                  <input
                    type="number"
                    value={editProfile.height}
                    onChange={(e) => setEditProfile({...editProfile, height: parseInt(e.target.value)})}
                    className={`w-full p-2 rounded-lg ${themeClasses.inputBg} ${themeClasses.text} ${themeClasses.border} border`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text} mb-1`}>Kilo (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editProfile.weight}
                    onChange={(e) => setEditProfile({...editProfile, weight: parseFloat(e.target.value)})}
                    className={`w-full p-2 rounded-lg ${themeClasses.inputBg} ${themeClasses.text} ${themeClasses.border} border`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text} mb-1`}>Hedef Kilo (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editProfile.targetWeight}
                    onChange={(e) => setEditProfile({...editProfile, targetWeight: parseFloat(e.target.value)})}
                    className={`w-full p-2 rounded-lg ${themeClasses.inputBg} ${themeClasses.text} ${themeClasses.border} border`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeClasses.text} mb-1`}>Fitness Seviyesi</label>
                <select
                  value={editProfile.fitnessLevel}
                  onChange={(e) => setEditProfile({...editProfile, fitnessLevel: e.target.value})}
                  className={`w-full p-2 rounded-lg ${themeClasses.inputBg} ${themeClasses.text} ${themeClasses.border} border`}
                >
                  <option value="Başlangıç">Başlangıç</option>
                  <option value="Orta">Orta</option>
                  <option value="İleri">İleri</option>
                  <option value="Uzman">Uzman</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>Hedefler</label>
                <div className="space-y-2">
                  {['Kilo Verme', 'Kilo Alma', 'Kas Kütlesi Artırma', 'Dayanıklılık', 'Güç Artırma'].map((goal) => (
                    <label key={goal} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editProfile.goals.includes(goal)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEditProfile({...editProfile, goals: [...editProfile.goals, goal]});
                          } else {
                            setEditProfile({...editProfile, goals: editProfile.goals.filter(g => g !== goal)});
                          }
                        }}
                        className="rounded"
                      />
                      <span className={`text-sm ${themeClasses.text}`}>{goal}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowProfileEdit(false)}
                className={`flex-1 px-4 py-2 rounded-lg ${themeClasses.inputBg} ${themeClasses.text} font-medium`}
              >
                İptal
              </button>
              <button
                onClick={saveProfile}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Ana Sayfa', icon: User },
    { id: 'workout', label: 'Antrenman', icon: Calendar },
    { id: 'progress', label: 'İlerleme', icon: TrendingUp },
    { id: 'profile', label: 'Profil', icon: Settings }
  ];

  return (
    <div className={`max-w-md mx-auto ${themeClasses.bg} min-h-screen transition-colors`}>
      <div className={`${themeClasses.cardBg} ${themeClasses.border} border-b p-4`}>
        <h1 className={`text-xl font-bold text-center ${themeClasses.text}`}>MetricFit</h1>
        <p className={`text-xs text-center ${themeClasses.textSecondary} mt-1`}>
          © Kemal Çetin
        </p>
      </div>

      <div className="p-4 pb-20">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'workout' && renderWorkout()}
        {activeTab === 'progress' && renderProgress()}
        {activeTab === 'profile' && renderProfile()}
      </div>

      <div className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md ${themeClasses.cardBg} ${themeClasses.border} border-t`}>
        <div className="flex justify-around py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center p-2 transition-colors ${
                  activeTab === tab.id ? 'text-blue-600' : themeClasses.textSecondary
                }`}
              >
                <Icon size={20} />
                <span className="text-xs mt-1">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MetricFit;
