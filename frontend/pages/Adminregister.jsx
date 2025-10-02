import { useEffect, useState } from 'react';
import { Sidebar } from "../components/Sidebar";
import '../src/styleCss/adminpage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboardTeacher, faBook, faUserGraduate } from '@fortawesome/free-solid-svg-icons';
import { Enseignant } from './Admin/Enseignant';
import {Modules} from './Admin/Modules'
import {Enseignement} from './Admin/Enseignement'
import {Alerts} from './Admin/Alerts'
import {Notifications} from './Admin/Notifications'
import { apiRequest } from '../utils/fetchapi';

export function Adminregister() {
    const [currentView, setCurrentView] = useState('dashboard');
    const [stats, setState] = useState({
        modules: 24,
        enseignants: 42,
        etudiants: 356
    });
    const [sidebarWidth, setSidebarWidth] = useState(350);

    const statistique = async ()=>{
        const etudiant = await apiRequest('/Etudiant', 'GET')
        const enseignant = await apiRequest('/Enseignant', 'GET')
        const modules = await apiRequest('/Modules', 'GET')
        setState({
            modules: modules.nbr,
            enseignants: enseignant.nbr,
            etudiants: etudiant.nbr
        })
    }

    useEffect(()=>{
        statistique()
    }, [])

    const handleViewChange = (view) => {
        setCurrentView(view);
    };

    const handleSidebarWidthChange = (newWidth) => {
        setSidebarWidth(newWidth);
    };

    const renderView = () => {
        switch(currentView) {
            case 'enseignants':
                return <Enseignant/>
            case 'modules':
                return <Modules/>
            case 'alerts':
                return <Alerts/>
            case 'notifications':
                return <Notifications/>
            case 'enseignement':
                return <Enseignement/>
            
            case 'dashboard':
            default:
                return (
                    <div className="stats-container">
                        <div className="stat-card module-card">
                            <div className="stat-icon">
                                <FontAwesomeIcon icon={faBook} />
                            </div>
                            <div className="stat-info">
                                <h3>Modules</h3>
                                <p className="stat-value">{stats.modules}</p>
                                <p className="stat-description">Total des modules disponibles</p>
                            </div>
                        </div>

                        <div className="stat-card teacher-card">
                            <div className="stat-icon">
                                <FontAwesomeIcon icon={faChalkboardTeacher} />
                            </div>
                            <div className="stat-info">
                                <h3>Enseignants</h3>
                                <p className="stat-value">{stats.enseignants}</p>
                                <p className="stat-description">Enseignants actifs</p>
                            </div>
                        </div>

                        <div className="stat-card student-card">
                            <div className="stat-icon">
                                <FontAwesomeIcon icon={faUserGraduate} />
                            </div>
                            <div className="stat-info">
                                <h3>Étudiants</h3>
                                <p className="stat-value">{stats.etudiants}</p>
                                <p className="stat-description">Étudiants inscrits</p>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="adminPage">        
            <Sidebar 
                onViewChange={handleViewChange} 
                onWidthChange={handleSidebarWidthChange}
            />
            <div 
                className="main-content"
                style={{ marginLeft: `${sidebarWidth}px` }}
            >
                <h1 className="dashboard-title">Tableau de Bord Administratif</h1>
                {renderView()}
            </div>
        </div>
    );
}