import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, BookOpen, Calculator, Bell, User, Moon, Sun, Menu, X, Heart, Shield, Clock, Plus, Edit, Trash2, Globe } from 'lucide-react';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('protocols');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [showAddProtocol, setShowAddProtocol] = useState(false);
  const [newProtocol, setNewProtocol] = useState({ title: '', specialty: '', content: '' });
  const [language, setLanguage] = useState('es');
  const [notifications, setNotifications] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Mock data for medical protocols
  const protocols = [
    {
      id: 1,
      title: 'Protocolo de Reanimación Cardiopulmonar (RCP)',
      specialty: 'Emergencias',
      category: 'Cardiología',
      lastUpdated: '2024-01-15',
      content: 'Procedimiento para reanimación cardiopulmonar en adultos, niños y lactantes. Incluye secuencia de compresiones torácicas, ventilaciones y uso de DEA.',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Manejo de Hipoglucemia',
      specialty: 'Endocrinología',
      category: 'Diabetes',
      lastUpdated: '2024-01-10',
      content: 'Protocolo para identificar y tratar hipoglucemia en pacientes diabéticos. Incluye escalones de tratamiento según nivel de glucosa.',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Protocolo de Lavado de Manos',
      specialty: 'Infecciones',
      category: 'Higiene',
      lastUpdated: '2024-01-08',
      content: 'Procedimiento estandarizado para el lavado de manos en entornos hospitalarios. Duración mínima de 40-60 segundos.',
      priority: 'high'
    },
    {
      id: 4,
      title: 'Evaluación de Escala de Glasgow',
      specialty: 'Neurología',
      category: 'Trauma',
      lastUpdated: '2024-01-12',
      content: 'Sistema de evaluación del nivel de conciencia en pacientes con trauma craneoencefálico. Puntuación de 3 a 15.',
      priority: 'high'
    }
  ];

  const specialties = ['Emergencias', 'Cardiología', 'Endocrinología', 'Neurología', 'Infecciones', 'Pediatría', 'Geriatría'];

  // Mock data for medical calculators
  const calculators = [
    { id: 'bmi', name: 'Índice de Masa Corporal', icon: 'Calculator' },
    { id: 'drug', name: 'Cálculo de Dosis', icon: 'Calculator' },
    { id: 'fluid', name: 'Balance Hidrico', icon: 'Calculator' },
    { id: 'gcs', name: 'Escala de Glasgow', icon: 'Calculator' }
  ];

  // Translations
  const translations = {
    es: {
      title: 'NursingPro',
      subtitle: 'Aplicación Avanzada de Enfermería',
      protocols: 'Protocolos',
      search: 'Buscar enfermedades',
      tools: 'Herramientas',
      notifications: 'Notificaciones',
      profile: 'Perfil',
      searchPlaceholder: 'Buscar protocolos, enfermedades o síntomas...',
      addProtocol: 'Añadir Protocolo',
      specialty: 'Especialidad',
      save: 'Guardar',
      cancel: 'Cancelar',
      noResults: 'No se encontraron resultados',
      lastUpdated: 'Última actualización',
      searchDiseases: 'Buscar Enfermedades',
      wikipedia: 'Wikipedia',
      medline: 'MedlinePlus',
      mayo: 'Mayo Clinic',
      calculate: 'Calcular',
      bmi: 'IMC',
      weight: 'Peso (kg)',
      height: 'Altura (cm)',
      result: 'Resultado',
      normal: 'Normal',
      overweight: 'Sobrepeso',
      obese: 'Obesidad',
      darkMode: 'Modo Oscuro',
      language: 'Idioma',
      english: 'Inglés',
      spanish: 'Español'
    },
    en: {
      title: 'NursingPro',
      subtitle: 'Advanced Nursing Application',
      protocols: 'Protocols',
      search: 'Search diseases',
      tools: 'Tools',
      notifications: 'Notifications',
      profile: 'Profile',
      searchPlaceholder: 'Search protocols, diseases or symptoms...',
      addProtocol: 'Add Protocol',
      specialty: 'Specialty',
      save: 'Save',
      cancel: 'Cancel',
      noResults: 'No results found',
      lastUpdated: 'Last updated',
      searchDiseases: 'Search Diseases',
      wikipedia: 'Wikipedia',
      medline: 'MedlinePlus',
      mayo: 'Mayo Clinic',
      calculate: 'Calculate',
      bmi: 'BMI',
      weight: 'Weight (kg)',
      height: 'Height (cm)',
      result: 'Result',
      normal: 'Normal',
      overweight: 'Overweight',
      obese: 'Obesity',
      darkMode: 'Dark Mode',
      language: 'Language',
      english: 'English',
      spanish: 'Spanish'
    }
  };

  const t = translations[language];

  // Filtered protocols based on search
  const filteredProtocols = useMemo(() => {
    if (!searchQuery) return protocols;
    return protocols.filter(protocol =>
      protocol.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      protocol.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      protocol.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, protocols]);

  // Add sample notification
  useEffect(() => {
    const sampleNotification = {
      id: 1,
      title: 'Actualización de Protocolo',
      message: 'El protocolo de RCP ha sido actualizado con nuevas pautas 2024',
      time: 'hace 2 horas',
      read: false
    };
    setNotifications([sampleNotification]);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Handle protocol addition
  const handleAddProtocol = () => {
    if (newProtocol.title && newProtocol.specialty && newProtocol.content) {
      const protocol = {
        id: protocols.length + 1,
        ...newProtocol,
        lastUpdated: new Date().toISOString().split('T')[0],
        priority: 'medium'
      };
      // In a real app, this would be saved to a database
      console.log('Adding protocol:', protocol);
      setNewProtocol({ title: '', specialty: '', content: '' });
      setShowAddProtocol(false);
    }
  };

  // Medical calculator - BMI
  const [bmiData, setBmiData] = useState({ weight: '', height: '' });
  const bmiResult = useMemo(() => {
    if (bmiData.weight && bmiData.height) {
      const weight = parseFloat(bmiData.weight);
      const height = parseFloat(bmiData.height) / 100;
      if (weight > 0 && height > 0) {
        const bmi = weight / (height * height);
        let category = t.normal;
        if (bmi >= 25) category = t.overweight;
        if (bmi >= 30) category = t.obese;
        return { value: bmi.toFixed(1), category };
      }
    }
    return null;
  }, [bmiData, t]);

  const handleBmiChange = (field, value) => {
    setBmiData(prev => ({ ...prev, [field]: value }));
  };

  const clearBmi = () => {
    setBmiData({ weight: '', height: '' });
  };

  // Mock disease search function
  const handleDiseaseSearch = useCallback((query) => {
    if (query) {
      console.log(`Searching for disease: ${query}`);
      // In a real app, this would call external APIs
      // Wikipedia API: https://en.wikipedia.org/api/rest_v1/page/summary/{title}
      // MedlinePlus API: https://medlineplus.gov/api/
    }
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className={`h-8 w-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <h1 className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                {t.title}
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {[
                { id: 'protocols', label: t.protocols, icon: BookOpen },
                { id: 'search', label: t.search, icon: Search },
                { id: 'tools', label: t.tools, icon: Calculator },
                { id: 'notifications', label: t.notifications, icon: Bell },
                { id: 'profile', label: t.profile, icon: User }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activeTab === item.id
                      ? darkMode
                        ? 'bg-gray-700 text-blue-400'
                        : 'bg-blue-50 text-blue-700'
                      : darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Right side controls */}
            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
                className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors duration-200`}
                aria-label="Toggle language"
              >
                <Globe className="h-5 w-5" />
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors duration-200`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 rounded-md"
              >
                {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className={`md:hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {[
                { id: 'protocols', label: t.protocols, icon: BookOpen },
                { id: 'search', label: t.search, icon: Search },
                { id: 'tools', label: t.tools, icon: Calculator },
                { id: 'notifications', label: t.notifications, icon: Bell },
                { id: 'profile', label: t.profile, icon: User }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setShowMobileMenu(false);
                  }}
                  className={`flex items-center space-x-3 w-full px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    activeTab === item.id
                      ? darkMode
                        ? 'bg-gray-700 text-blue-400'
                        : 'bg-blue-50 text-blue-700'
                      : darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className={`relative rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
            </div>
            <input
              type="text"
              className={`block w-full pl-10 pr-3 py-3 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-800 text-white placeholder-gray-400 focus:bg-gray-700' 
                  : 'bg-white text-gray-900 placeholder-gray-500 focus:bg-gray-50'
              }`}
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleDiseaseSearch(searchQuery);
                }
              }}
            />
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'protocols' && (
          <div className="space-y-6">
            {/* Header with Add Protocol button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div>
                <h2 className="text-2xl font-bold">Protocolos Médicos</h2>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                  Biblioteca completa de protocolos médicos actualizados
                </p>
              </div>
              <button
                onClick={() => setShowAddProtocol(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t.addProtocol}
              </button>
            </div>

            {/* Protocol Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProtocols.length > 0 ? (
                filteredProtocols.map((protocol) => (
                  <div
                    key={protocol.id}
                    className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${
                      darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className={`h-2 ${
                      protocol.priority === 'high' ? 'bg-red-500' : 
                      protocol.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold line-clamp-2">{protocol.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {protocol.specialty}
                        </span>
                      </div>
                      <p className={`text-sm mb-4 line-clamp-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {protocol.content}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {t.lastUpdated}: {protocol.lastUpdated}
                        </span>
                        <button
                          onClick={() => setSelectedProtocol(protocol)}
                          className={`text-sm font-medium ${
                            darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                          }`}
                        >
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`col-span-full text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">{t.noResults}</p>
                  <p className="mt-2">Intenta con otro término de búsqueda</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">{t.searchDiseases}</h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              Busca información médica confiable desde múltiples fuentes
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { source: t.wikipedia, color: 'from-blue-500 to-blue-600', icon: 'W' },
                { source: t.medline, color: 'from-green-500 to-green-600', icon: 'M' },
                { source: t.mayo, color: 'from-teal-500 to-teal-600', icon: 'M' }
              ].map((source, index) => (
                <div
                  key={index}
                  className={`rounded-xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
                  } shadow-lg`}
                  onClick={() => searchQuery && handleDiseaseSearch(`${searchQuery} ${source.source}`)}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${source.color} flex items-center justify-center mb-4`}>
                    <span className="text-white font-bold text-lg">{source.icon}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{source.source}</h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                    Información médica detallada y actualizada
                  </p>
                </div>
              ))}
            </div>

            {searchQuery && (
              <div className={`mt-8 p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <h3 className="text-lg font-semibold mb-4">Resultados para: "{searchQuery}"</h3>
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h4 className="font-medium">Información General</h4>
                    <p className={`text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      En una aplicación real, aquí se mostraría información detallada obtenida de las APIs médicas.
                      El sistema integraría datos de Wikipedia, MedlinePlus y otras fuentes confiables.
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h4 className="font-medium">Síntomas y Diagnóstico</h4>
                    <p className={`text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Información sobre síntomas comunes, métodos de diagnóstico y criterios clínicos.
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h4 className="font-medium">Tratamiento</h4>
                    <p className={`text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Protocolos de tratamiento, medicamentos recomendados y opciones terapéuticas.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Herramientas Médicas</h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              Calculadoras y herramientas interactivas para apoyar tu práctica clínica
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {calculators.map((calculator) => (
                <div
                  key={calculator.id}
                  className={`rounded-xl p-6 transition-all duration-300 ${
                    darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
                  } shadow-lg cursor-pointer`}
                >
                  <div className={`w-12 h-12 rounded-lg ${
                    darkMode ? 'bg-blue-900' : 'bg-blue-100'
                  } flex items-center justify-center mb-4`}>
                    <Calculator className={`h-6 w-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{calculator.name}</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Herramienta interactiva para cálculos médicos precisos
                  </p>
                </div>
              ))}
            </div>

            {/* BMI Calculator */}
            <div className={`mt-8 p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Calculadora de Índice de Masa Corporal (IMC)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t.weight}
                      </label>
                      <input
                        type="number"
                        value={bmiData.weight}
                        onChange={(e) => handleBmiChange('weight', e.target.value)}
                        placeholder="70"
                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t.height}
                      </label>
                      <input
                        type="number"
                        value={bmiData.height}
                        onChange={(e) => handleBmiChange('height', e.target.value)}
                        placeholder="170"
                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={clearBmi}
                        className={`flex-1 px-4 py-2 rounded-lg ${
                          darkMode 
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        } transition-colors duration-200`}
                      >
                        Limpiar
                      </button>
                      <button
                        onClick={() => {}}
                        disabled={!bmiData.weight || !bmiData.height}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        {t.calculate}
                      </button>
                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                  {bmiResult ? (
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">{bmiResult.value}</div>
                      <div className={`text-lg font-medium mb-4 ${
                        bmiResult.category === t.normal ? 'text-green-500' :
                        bmiResult.category === t.overweight ? 'text-yellow-500' : 'text-red-500'
                      }`}>
                        {bmiResult.category}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <p>Clasificación según la Organización Mundial de la Salud</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                        Ingrese peso y altura para calcular el IMC
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Notificaciones</h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              Mantente actualizado con las últimas actualizaciones y alertas
            </p>

            <div className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg overflow-hidden`}>
              {notifications.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {notifications.map((notification) => (
                    <li key={notification.id} className={`p-6 ${!notification.read ? darkMode ? 'bg-blue-900/20' : 'bg-blue-50' : ''}`}>
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                          darkMode ? 'bg-blue-900' : 'bg-blue-100'
                        }`}>
                          <Bell className={`h-4 w-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">{notification.title}</h3>
                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {notification.time}
                            </span>
                          </div>
                          <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {notification.message}
                          </p>
                          {!notification.read && (
                            <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              Nuevo
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No tienes notificaciones</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Perfil del Usuario</h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              Gestiona tu información y preferencias
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className={`lg:col-span-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                <h3 className="text-lg font-semibold mb-6">Información Personal</h3>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        defaultValue="María González"
                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        defaultValue="maria.gonzalez@hospital.com"
                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Especialidad
                    </label>
                    <select
                      className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      {specialties.map((specialty) => (
                        <option key={specialty} value={specialty}>
                          {specialty}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Número de Licencia
                      </label>
                      <input
                        type="text"
                        defaultValue="ENF-12345"
                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Guardar Cambios
                    </button>
                    <button
                      type="button"
                      className={`px-6 py-2 ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      } rounded-lg transition-colors duration-200`}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>

              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                <h3 className="text-lg font-semibold mb-6">Preferencias</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{t.darkMode}</span>
                    <button
                      onClick={toggleDarkMode}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        darkMode ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          darkMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t.language}
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="es">{t.spanish}</option>
                      <option value="en">{t.english}</option>
                    </select>
                  </div>
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium mb-2">Seguridad</h4>
                    <button
                      className={`w-full text-left px-4 py-2 rounded-lg ${
                        darkMode 
                          ? 'hover:bg-gray-700 text-gray-300' 
                          : 'hover:bg-gray-100 text-gray-700'
                      } transition-colors duration-200 flex items-center`}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Cambiar Contraseña
                    </button>
                    <button
                      className={`w-full text-left px-4 py-2 rounded-lg ${
                        darkMode 
                          ? 'hover:bg-gray-700 text-gray-300' 
                          : 'hover:bg-gray-100 text-gray-700'
                      } transition-colors duration-200 flex items-center mt-2`}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Actividad Reciente
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Protocol Modal */}
      {showAddProtocol && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-xl shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Añadir Nuevo Protocolo</h3>
                <button
                  onClick={() => setShowAddProtocol(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Título del Protocolo
                  </label>
                  <input
                    type="text"
                    value={newProtocol.title}
                    onChange={(e) => setNewProtocol(prev => ({ ...prev, title: e.target.value }))}
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Ej: Protocolo de Reanimación Cardiopulmonar"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t.specialty}
                  </label>
                  <select
                    value={newProtocol.specialty}
                    onChange={(e) => setNewProtocol(prev => ({ ...prev, specialty: e.target.value }))}
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">Seleccionar especialidad</option>
                    {specialties.map((specialty) => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Contenido del Protocolo
                  </label>
                  <textarea
                    value={newProtocol.content}
                    onChange={(e) => setNewProtocol(prev => ({ ...prev, content: e.target.value }))}
                    rows={6}
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Descripción detallada del protocolo, pasos a seguir, indicaciones, etc."
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleAddProtocol}
                  disabled={!newProtocol.title || !newProtocol.specialty || !newProtocol.content}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {t.save}
                </button>
                <button
                  onClick={() => setShowAddProtocol(false)}
                  className={`flex-1 px-4 py-2 ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } rounded-lg transition-colors duration-200`}
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={`mt-12 py-8 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Heart className={`h-6 w-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className="ml-2 text-lg font-semibold">NursingPro</span>
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2024 NursingPro. Todos los derechos reservados.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className={darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}>
                Privacidad
              </a>
              <a href="#" className={darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}>
                Términos
              </a>
              <a href="#" className={darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}>
                Soporte
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
