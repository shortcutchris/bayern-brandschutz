import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Eye, Edit, Trash2, Filter, Download, Upload, Workflow, Shield, Droplets, Mail, Wand2, BarChart3, PieChart, MapPin, Calendar, FileText, Database, TrendingUp, Users, Building, Clock, Moon, Sun, X, CheckCircle, AlertCircle, Info, Calculator, Scale, BookOpen, Award, FileCheck, Send, Phone, MessageSquare, Archive, RefreshCw, Settings, UserCheck, AlertTriangle, Zap, Target } from 'lucide-react';

// Bayern-Compliance Engine
const bayernCompliance = {
  gebaeudeklassen: {
    1: { hoehe: "≤ 7m", anforderungen: ["Brandschutznachweis"], sachverstaendiger: false },
    2: { hoehe: "≤ 7m", anforderungen: ["Brandschutznachweis", "Sonderbau"], sachverstaendiger: false },
    3: { hoehe: "≤ 13m", anforderungen: ["Fachplaner", "Brandschutzkonzept"], sachverstaendiger: false },
    4: { hoehe: "≤ 22m", anforderungen: ["Fachplaner", "Prüfsachverständiger"], sachverstaendiger: true },
    5: { hoehe: "> 22m", anforderungen: ["Fachplaner", "Prüfsachverständiger", "Gutachten"], sachverstaendiger: true }
  },

  calculateRequirements: (building) => {
    const { hoehe, sonderbau } = building;
    let klasse = 1;
    
    if (sonderbau) klasse = 2;
    else if (hoehe <= 7) klasse = 1;
    else if (hoehe <= 13) klasse = 3;
    else if (hoehe <= 22) klasse = 4;
    else klasse = 5;

    const requirements = bayernCompliance.gebaeudeklassen[klasse];
    const warnings = [];
    
    if (!building.zufahrtBreite || building.zufahrtBreite < 3.5) {
      warnings.push("Zufahrtsbreite < 3,5m - DIN 14090 prüfen");
    }
    if (!building.aufstellflaeche && klasse >= 3) {
      warnings.push("Aufstellfläche für Feuerwehr erforderlich");
    }

    return {
      gebaeudeklasse: klasse,
      ...requirements,
      complianceWarnings: warnings
    };
  }
};

// Löschwasser-Calculator
const loeschwasserCalculator = {
  berechnung: (gebaeudeDaten) => {
    const { grundflaeche, nutzung, brandlast } = gebaeudeDaten;
    const faktoren = { wohnen: 96, büro: 96, lager: 192, produktion: 288 };
    const faktor = faktoren[nutzung] || 96;
    
    const grundbedarf = Math.max(96, Math.min(grundflaeche * faktor / 1000, 3200));
    const zusatzbedarf = brandlast > 1000 ? 192 : 0;
    const gesamtbedarf = grundbedarf + zusatzbedarf;
    
    return {
      grundbedarf,
      zusatzbedarf,
      gesamtbedarf,
      empfohleneVersorgung: gesamtbedarf > 1600 ? 'Löschwasserteich' : 'Hydrantennetz',
      normenkonformitaet: gesamtbedarf >= 96
    };
  }
};

// Enhanced Custom Hooks
const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  return { notifications, addNotification };
};

const useRecords = () => {
  const [records, setRecords] = useState([
    {
      id: 1,
      intNr: 'B-25-06-021-Oliv',
      auftraggeber: 'Huber Holz GmbH',
      vorname: 'Stefan und Tina',
      nachname: 'Oliv',
      strasse: 'Waldsiedlung 26',
      plz: '82041',
      ort: 'Deisenhofen',
      telefon: '089/12345678',
      email: 'stefan.oliv@email.de',
      bauvorhaben: 'Umbau Einfamilienhaus zu Zweifamilienhaus',
      
      gebaeudeDaten: {
        hoehe: 8.5,
        geschosse: 2,
        grundflaeche: 180,
        nutzung: 'wohnen',
        sonderbau: false,
        brandlast: 800,
        zufahrtBreite: 4.5,
        aufstellflaeche: true
      },
      
      status: 'In Bearbeitung',
      erstelldatum: '06.06.2025',
      
      prozesse: {
        brandschutz: {
          aktiv: true,
          fortschritt: 60,
          schritte: [
            { name: 'Bayern-Compliance geprüft', status: 'abgeschlossen' },
            { name: 'Brandschutzkonzept erstellt', status: 'in_bearbeitung' },
            { name: 'Qualitätsprüfung', status: 'ausstehend' },
            { name: 'Freigabe', status: 'ausstehend' }
          ]
        },
        loeschwasser: {
          aktiv: false,
          fortschritt: 0,
          schritte: [
            { name: 'Bedarf berechnet', status: 'ausstehend' },
            { name: 'Feuerwehr kontaktiert', status: 'ausstehend' },
            { name: 'Versorgung geprüft', status: 'ausstehend' },
            { name: 'Bestätigung erhalten', status: 'ausstehend' }
          ]
        },
        sachverstaendiger: {
          aktiv: false,
          erforderlich: false,
          fortschritt: 0
        }
      }
    },
    {
      id: 2,
      intNr: 'B-10-01-014-Prinz',
      auftraggeber: 'Prinz Bauunternehmen',
      vorname: 'Rudolf',
      nachname: 'Prinz',
      strasse: 'Adelsberg 1',
      plz: '84367',
      ort: 'Tann',
      telefon: '08572/98765',
      email: 'r.prinz@bauunternehmen.de',
      bauvorhaben: 'Neubau Industriehalle mit Bürotrakt',
      
      gebaeudeDaten: {
        hoehe: 15.5,
        geschosse: 1,
        grundflaeche: 3200,
        nutzung: 'lager',
        sonderbau: false,
        brandlast: 1500,
        zufahrtBreite: 6.0,
        aufstellflaeche: true
      },
      
      status: 'Genehmigt',
      erstelldatum: '01.03.2024',
      
      prozesse: {
        brandschutz: {
          aktiv: true,
          fortschritt: 100,
          schritte: [
            { name: 'Bayern-Compliance geprüft', status: 'abgeschlossen' },
            { name: 'Brandschutzkonzept erstellt', status: 'abgeschlossen' },
            { name: 'Qualitätsprüfung', status: 'abgeschlossen' },
            { name: 'Freigabe', status: 'abgeschlossen' }
          ]
        },
        loeschwasser: {
          aktiv: true,
          fortschritt: 100,
          schritte: [
            { name: 'Bedarf berechnet', status: 'abgeschlossen' },
            { name: 'Feuerwehr kontaktiert', status: 'abgeschlossen' },
            { name: 'Versorgung geprüft', status: 'abgeschlossen' },
            { name: 'Bestätigung erhalten', status: 'abgeschlossen' }
          ]
        },
        sachverstaendiger: {
          aktiv: true,
          erforderlich: true,
          fortschritt: 100,
          sachverstaendiger: 'Dr. Hans Müller'
        }
      }
    }
  ]);

  // Automatische Compliance-Berechnung
  useEffect(() => {
    setRecords(prev => prev.map(record => {
      if (record.gebaeudeDaten) {
        const compliance = bayernCompliance.calculateRequirements(record.gebaeudeDaten);
        const loeschwasserBerechnung = loeschwasserCalculator.berechnung(record.gebaeudeDaten);
        
        return {
          ...record,
          compliance,
          loeschwasserBerechnung
        };
      }
      return record;
    }));
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const createRecord = async (recordData) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newRecord = {
      ...recordData,
      id: Date.now(),
      intNr: `B-25-07-${String(records.length + 1).padStart(3, '0')}-${recordData.nachname || 'Neu'}`,
      erstelldatum: new Date().toLocaleDateString('de-DE'),
      status: 'In Bearbeitung'
    };

    setRecords(prev => [...prev, newRecord]);
    setIsLoading(false);
    return newRecord;
  };

  const updateRecord = async (id, updates) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setRecords(prev => prev.map(record => 
      record.id === id ? { ...record, ...updates } : record
    ));
    setIsLoading(false);
  };

  const deleteRecord = async (id) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setRecords(prev => prev.filter(record => record.id !== id));
    setIsLoading(false);
  };

  return { records, isLoading, createRecord, updateRecord, deleteRecord };
};

// Component Definitions
const NotificationSystem = ({ notifications, darkMode }) => (
  <div className="fixed top-4 right-4 space-y-2 z-50 max-w-sm">
    {notifications.map((notification) => (
      <div
        key={notification.id}
        className={`flex items-center space-x-2 px-4 py-3 rounded-lg shadow-lg border transition-all duration-300 ${
          darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
        }`}
      >
        {notification.type === 'success' && <CheckCircle className="h-5 w-5 text-emerald-500" />}
        {notification.type === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
        {notification.type === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-500" />}
        {notification.type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
        <span className="text-sm flex-1">{notification.message}</span>
      </div>
    ))}
  </div>
);

const Header = ({ darkMode, setDarkMode, onDashboard, onProcessOverview, onComplianceCheck, onSachverstaendigerPortal }) => (
  <div className={`shadow-sm border-b transition-colors duration-200 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-4">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Bayern Brandschutz Management
          </h1>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            IB Rinner - BayBO konforme Brandschutz- & Löschwasserkonzepte
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg transition-all duration-200 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          <button 
            onClick={onComplianceCheck}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Scale className="h-4 w-4" />
            <span>Bayern-Check</span>
          </button>
          
          <button 
            onClick={onSachverstaendigerPortal}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Award className="h-4 w-4" />
            <span>Sachverständige</span>
          </button>
          
          <button 
            onClick={onDashboard}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Dashboard</span>
          </button>
          
          <button 
            onClick={onProcessOverview}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Workflow className="h-4 w-4" />
            <span>Prozesse</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

const Breadcrumb = ({ darkMode, currentView, onNavigateHome }) => (
  <div className={`border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <nav className="flex items-center space-x-2 text-sm">
        <button
          onClick={onNavigateHome}
          className={`flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}
        >
          <Building className="h-4 w-4" />
          <span>Bayern Brandschutz</span>
        </button>
        
        {currentView !== 'home' && (
          <>
            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>→</span>
            <span className={`px-2 py-1 rounded ${
              currentView === 'dashboard' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400' :
              currentView === 'processes' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-400' :
              currentView === 'compliance' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400' :
              currentView === 'sachverstaendiger' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-400' :
              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {currentView === 'dashboard' && 'Dashboard'}
              {currentView === 'processes' && 'Prozess-Übersicht'}
              {currentView === 'compliance' && 'Bayern-Compliance'}
              {currentView === 'sachverstaendiger' && 'Sachverständigen-Portal'}
              {currentView === 'detail' && 'Projekt-Details'}
              {currentView === 'form' && 'Projekt bearbeiten'}
            </span>
          </>
        )}
      </nav>
    </div>
  </div>
);

const ComplianceIndicator = ({ record, darkMode }) => {
  if (!record.compliance) return null;

  const { gebaeudeklasse, sachverstaendiger, complianceWarnings } = record.compliance;
  
  return (
    <div className="flex items-center space-x-2">
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${
        gebaeudeklasse >= 4 
          ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800'
          : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
      }`}>
        GK {gebaeudeklasse}
      </span>
      
      {sachverstaendiger && (
        <Award className="h-4 w-4 text-purple-600" title="Sachverständiger erforderlich" />
      )}
      
      {complianceWarnings && complianceWarnings.length > 0 && (
        <AlertTriangle className="h-4 w-4 text-amber-500" title={`${complianceWarnings.length} Warnung(en)`} />
      )}
    </div>
  );
};

const RecordTable = ({ records, darkMode, onViewRecord, onEditRecord, onDeleteRecord }) => (
  <div className={`rounded-lg shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
    <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        Bayern Brandschutzprojekte ({records.length})
      </h3>
    </div>
    
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-50'}>
          <tr>
            <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Projekt / Compliance
            </th>
            <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Antragsteller
            </th>
            <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Bauvorhaben
            </th>
            <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Status & Prozesse
            </th>
            <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Aktionen
            </th>
          </tr>
        </thead>
        <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {records.map((record) => (
            <tr key={record.id} className={`transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
              <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                <div>
                  {record.intNr}
                  <div className="mt-1">
                    <ComplianceIndicator record={record} darkMode={darkMode} />
                  </div>
                </div>
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {record.vorname} {record.nachname}
              </td>
              <td className={`px-6 py-4 text-sm max-w-xs truncate ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {record.bauvorhaben}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    record.status === 'Genehmigt' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                    record.status === 'In Bearbeitung' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                    record.status === 'Prüfung' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {record.status}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <Shield className={`h-4 w-4 ${
                      record.prozesse.brandschutz.fortschritt === 100 ? 'text-emerald-500' :
                      record.prozesse.brandschutz.aktiv ? 'text-orange-500' : 'text-gray-400'
                    }`} title="Brandschutz" />
                    <Droplets className={`h-4 w-4 ${
                      record.prozesse.loeschwasser.fortschritt === 100 ? 'text-emerald-500' :
                      record.prozesse.loeschwasser.aktiv ? 'text-blue-500' : 'text-gray-400'
                    }`} title="Löschwasser" />
                    {record.prozesse.sachverstaendiger.erforderlich && (
                      <Award className={`h-4 w-4 ${
                        record.prozesse.sachverstaendiger.fortschritt === 100 ? 'text-emerald-500' :
                        record.prozesse.sachverstaendiger.aktiv ? 'text-purple-500' : 'text-gray-400'
                      }`} title="Sachverständiger" />
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onViewRecord(record)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 p-1 rounded transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEditRecord(record)}
                    className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 p-1 rounded transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onDeleteRecord(record)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 p-1 rounded transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SearchPanel = ({ searchQuery, setSearchQuery, darkMode, onNewRecord }) => (
  <div className={`rounded-lg shadow-sm border p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
    <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Suche & Filter</h3>
    
    <div className="relative mb-4">
      <Search className={`h-4 w-4 absolute left-3 top-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
      <input
        type="text"
        placeholder="Projekt suchen..."
        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
          darkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'
        }`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>

    <div className="space-y-4">
      <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'} flex items-center space-x-2`}>
        <Scale className="h-4 w-4 text-red-600" />
        <span>Bayern-Compliance</span>
      </h4>
      
      <div className="space-y-2">
        <label className="flex items-center">
          <input type="checkbox" className="rounded text-blue-600" defaultChecked />
          <span className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Alle Projekte
          </span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" className="rounded text-blue-600" />
          <span className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Sachverständiger erforderlich
          </span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" className="rounded text-blue-600" />
          <span className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Mit Compliance-Warnungen
          </span>
        </label>
      </div>
    </div>

    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
      <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Aktionen</h4>
      <div className="space-y-2">
        <button
          onClick={onNewRecord}
          className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Neuer Antrag</span>
        </button>
        <button className={`w-full px-3 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
          darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-100' : 'bg-gray-600 hover:bg-gray-700 text-white'
        }`}>
          <Upload className="h-4 w-4" />
          <span>Import</span>
        </button>
        <button className={`w-full px-3 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
          darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-100' : 'bg-gray-600 hover:bg-gray-700 text-white'
        }`}>
          <Download className="h-4 w-4" />
          <span>Export</span>
        </button>
      </div>
    </div>
  </div>
);

const ComplianceDetails = ({ record, darkMode }) => {
  if (!record.compliance) return null;

  const { gebaeudeklasse, anforderungen, complianceWarnings, sachverstaendiger } = record.compliance;

  return (
    <div className={`border rounded-lg p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center space-x-3 mb-4">
        <Scale className="h-6 w-6 text-red-600" />
        <div>
          <h4 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Bayern-Compliance</h4>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Automatische Prüfung nach BayBO</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h5 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Gebäudeklassifizierung</h5>
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center space-x-2 mb-2">
              <span className={`inline-flex items-center px-2 py-1 text-sm font-semibold rounded-full border ${
                gebaeudeklasse >= 4 
                  ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800'
                  : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
              }`}>
                Gebäudeklasse {gebaeudeklasse}
              </span>
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {bayernCompliance.gebaeudeklassen[gebaeudeklasse]?.hoehe}
            </div>
          </div>
        </div>

        <div>
          <h5 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Erforderliche Beteiligung</h5>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <UserCheck className={`h-4 w-4 text-emerald-500`} />
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Fachplaner erforderlich
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className={`h-4 w-4 ${sachverstaendiger ? 'text-orange-500' : 'text-gray-400'}`} />
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Sachverständiger {sachverstaendiger ? 'erforderlich' : 'nicht erforderlich'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h5 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Rechtliche Anforderungen</h5>
        <div className="space-y-2">
          {anforderungen.map((anforderung, index) => (
            <div key={index} className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{anforderung}</span>
            </div>
          ))}
        </div>
      </div>

      {complianceWarnings && complianceWarnings.length > 0 && (
        <div className="mt-6">
          <h5 className={`text-sm font-medium mb-3 flex items-center space-x-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span>Compliance-Warnungen</span>
          </h5>
          <div className="space-y-2">
            {complianceWarnings.map((warning, index) => (
              <div key={index} className={`p-3 rounded-lg border-l-4 border-amber-400 ${darkMode ? 'bg-amber-900/20' : 'bg-amber-50'}`}>
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{warning}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const LoeschwasserDetails = ({ record, darkMode }) => {
  if (!record.loeschwasserBerechnung) return null;

  const { grundbedarf, zusatzbedarf, gesamtbedarf, empfohleneVersorgung, normenkonformitaet } = record.loeschwasserBerechnung;

  return (
    <div className={`border rounded-lg p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center space-x-3 mb-4">
        <Calculator className="h-6 w-6 text-blue-600" />
        <div>
          <h4 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Löschwasser-Berechnung</h4>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nach DVGW W 405</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
          <div className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{gesamtbedarf}L</div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gesamtbedarf</div>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{Math.round(gesamtbedarf/120)} l/min</div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Durchflussrate</div>
        </div>
        
        <div className={`p-4 rounded-lg ${normenkonformitaet ? (darkMode ? 'bg-emerald-900/20' : 'bg-emerald-50') : (darkMode ? 'bg-red-900/20' : 'bg-red-50')}`}>
          <div className={`text-xl font-semibold ${normenkonformitaet ? 'text-emerald-600' : 'text-red-600'}`}>
            {normenkonformitaet ? 'Konform' : 'Nicht konform'}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Normen-Status</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h5 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Bedarfsaufstellung</h5>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Grundbedarf:</span>
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{grundbedarf}L</span>
            </div>
            <div className="flex justify-between">
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Zusatzbedarf:</span>
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{zusatzbedarf}L</span>
            </div>
            <div className="h-px bg-gray-300 dark:bg-gray-600" />
            <div className="flex justify-between">
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Gesamtbedarf:</span>
              <span className={`text-sm font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{gesamtbedarf}L</span>
            </div>
          </div>
        </div>
        
        <div>
          <h5 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Empfohlene Versorgung</h5>
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{empfohleneVersorgung}</div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              Bereitstellungszeit: 2 Stunden
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BayernBrandschutzSystem = () => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { notifications, addNotification } = useNotifications();
  const { records, isLoading, createRecord, updateRecord, deleteRecord } = useRecords();

  const filteredRecords = useMemo(() => {
    if (!searchQuery) return records;
    return records.filter(record => 
      record.intNr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.auftraggeber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.bauvorhaben.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [records, searchQuery]);

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setCurrentView('detail');
  };

  const handleEditRecord = (record) => {
    setSelectedRecord(record);
    setCurrentView('form');
  };

  const handleDeleteRecord = async (record) => {
    if (window.confirm(`Antrag ${record.intNr} wirklich löschen?`)) {
      await deleteRecord(record.id);
      addNotification(`Antrag ${record.intNr} gelöscht`, 'success');
    }
  };

  const handleNavigateHome = () => {
    setCurrentView('home');
    setSelectedRecord(null);
  };

  const handleNewRecord = () => {
    setSelectedRecord(null);
    setCurrentView('form');
  };

  const renderMainContent = () => {
    if (currentView === 'dashboard') {
      return (
        <div className={`rounded-lg shadow-sm border p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Dashboard</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className={`p-6 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <div className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>89%</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Compliance-Rate</div>
            </div>
            <div className={`p-6 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <div className={`text-3xl font-bold text-orange-600`}>2</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sachverständiger erforderlich</div>
            </div>
            <div className={`p-6 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <div className={`text-3xl font-bold text-red-600`}>1</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Mit Warnungen</div>
            </div>
            <div className={`p-6 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <div className={`text-3xl font-bold text-purple-600`}>1</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gebäudeklasse 4-5</div>
            </div>
          </div>
        </div>
      );
    }

    if (currentView === 'compliance') {
      return (
        <div className={`rounded-lg shadow-sm border p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center space-x-3 mb-6">
            <Scale className="h-6 w-6 text-red-600" />
            <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Bayern-Compliance Dashboard</h3>
          </div>
          <div className="space-y-6">
            {records.map(record => (
              <div key={record.id} className={`border rounded-lg p-6 ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h5 className={`text-lg font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{record.intNr}</h5>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{record.auftraggeber}</p>
                  </div>
                  <ComplianceIndicator record={record} darkMode={darkMode} />
                </div>
                
                {record.compliance && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ComplianceDetails record={record} darkMode={darkMode} />
                    {record.loeschwasserBerechnung && (
                      <LoeschwasserDetails record={record} darkMode={darkMode} />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (currentView === 'sachverstaendiger') {
      const sachverstaendigerRecords = records.filter(r => r.compliance?.sachverstaendiger);
      
      return (
        <div className={`rounded-lg shadow-sm border p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center space-x-3 mb-6">
            <Award className="h-6 w-6 text-purple-600" />
            <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Sachverständigen-Portal</h3>
          </div>
          
          {sachverstaendigerRecords.length === 0 ? (
            <div className="text-center py-12">
              <Award className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>Keine Projekte mit Prüfpflicht</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Derzeit sind keine Projekte vorhanden, die eine Sachverständigenprüfung erfordern.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {sachverstaendigerRecords.map(record => (
                <div key={record.id} className={`border rounded-lg p-6 ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{record.intNr}</h4>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{record.auftraggeber} - {record.bauvorhaben}</p>
                    </div>
                    <ComplianceIndicator record={record} darkMode={darkMode} />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-purple-900/20' : 'bg-purple-50'}`}>
                      <div className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {record.prozesse.sachverstaendiger.fortschritt}%
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Prüffortschritt</div>
                    </div>
                    
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>GK {record.compliance.gebaeudeklasse}</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gebäudeklasse</div>
                    </div>
                    
                    <div className={`p-4 rounded-lg ${record.prozesse.sachverstaendiger.fortschritt === 100 ? (darkMode ? 'bg-emerald-900/20' : 'bg-emerald-50') : (darkMode ? 'bg-orange-900/20' : 'bg-orange-50')}`}>
                      <div className={`text-lg font-semibold ${record.prozesse.sachverstaendiger.fortschritt === 100 ? 'text-emerald-600' : 'text-orange-600'}`}>
                        {record.prozesse.sachverstaendiger.fortschritt === 100 ? 'Freigegeben' : 'Ausstehend'}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Prüfvermerk</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex space-x-3">
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors">
                      Unterlagen abrufen
                    </button>
                    <button className={`px-4 py-2 rounded-lg text-sm transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-100' : 'bg-gray-600 hover:bg-gray-700 text-white'}`}>
                      Prüfvermerk erstellen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (currentView === 'detail' && selectedRecord) {
      return (
        <div className={`rounded-lg shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
            <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              Projekt Details - {selectedRecord.intNr}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditRecord(selectedRecord)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Bearbeiten</span>
              </button>
              <button
                onClick={handleNavigateHome}
                className={`px-4 py-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-100' : 'bg-gray-600 hover:bg-gray-700 text-white'}`}
              >
                Zurück
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 gap-8">
              {/* Compliance & Löschwasser Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ComplianceDetails record={selectedRecord} darkMode={darkMode} />
                {selectedRecord.loeschwasserBerechnung && (
                  <LoeschwasserDetails record={selectedRecord} darkMode={darkMode} />
                )}
              </div>

              {/* Stammdaten */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h4 className={`text-lg font-semibold border-b pb-2 ${darkMode ? 'text-gray-100 border-gray-700' : 'text-gray-900 border-gray-200'}`}>
                    Antragsteller
                  </h4>
                  <dl className="space-y-3">
                    <div>
                      <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Auftraggeber</dt>
                      <dd className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{selectedRecord.auftraggeber}</dd>
                    </div>
                    <div>
                      <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Name</dt>
                      <dd className={`text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{selectedRecord.vorname} {selectedRecord.nachname}</dd>
                    </div>
                    <div>
                      <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Kontakt</dt>
                      <dd className={`text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        Tel: {selectedRecord.telefon}<br />
                        E-Mail: {selectedRecord.email}
                      </dd>
                    </div>
                  </dl>
                </div>
                
                <div className="space-y-6">
                  <h4 className={`text-lg font-semibold border-b pb-2 ${darkMode ? 'text-gray-100 border-gray-700' : 'text-gray-900 border-gray-200'}`}>
                    Bauobjekt
                  </h4>
                  <dl className="space-y-3">
                    <div>
                      <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Bauvorhaben</dt>
                      <dd className={`text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{selectedRecord.bauvorhaben}</dd>
                    </div>
                    <div>
                      <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Ort</dt>
                      <dd className={`text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{selectedRecord.ort}</dd>
                    </div>
                    <div>
                      <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</dt>
                      <dd>
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                          selectedRecord.status === 'Genehmigt' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                          selectedRecord.status === 'In Bearbeitung' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                          'bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {selectedRecord.status}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (currentView === 'form') {
      return (
        <div className={`rounded-lg shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              {selectedRecord ? `Antrag bearbeiten - ${selectedRecord.intNr}` : 'Neuer Bauantrag Bayern'}
            </h3>
          </div>
          
          <div className="p-6">
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>Formular in Entwicklung</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                Das erweiterte Bayern-Formular mit Compliance-Prüfung wird hier angezeigt.
              </p>
              <button
                onClick={handleNavigateHome}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Zurück zur Übersicht
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Default home view
    return (
      <RecordTable 
        records={filteredRecords}
        darkMode={darkMode}
        onViewRecord={handleViewRecord}
        onEditRecord={handleEditRecord}
        onDeleteRecord={handleDeleteRecord}
      />
    );
  };

  return (
    <div className={`min-h-screen transition-all duration-200 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <NotificationSystem notifications={notifications} darkMode={darkMode} />

      <Header 
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onDashboard={() => setCurrentView('dashboard')}
        onProcessOverview={() => setCurrentView('processes')}
        onComplianceCheck={() => setCurrentView('compliance')}
        onSachverstaendigerPortal={() => setCurrentView('sachverstaendiger')}
      />

      <Breadcrumb 
        darkMode={darkMode}
        currentView={currentView}
        onNavigateHome={handleNavigateHome}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <SearchPanel 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              darkMode={darkMode}
              onNewRecord={handleNewRecord}
            />
          </div>

          <div className="lg:col-span-3">
            {renderMainContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BayernBrandschutzSystem;