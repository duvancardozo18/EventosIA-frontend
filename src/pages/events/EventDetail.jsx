import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  FiCalendar,
  FiMapPin,
  FiTablet,
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiUser,
  FiDollarSign,
  FiPlus
} from 'react-icons/fi';

const tabs = ['Participantes', 'Recursos', 'Alimentos'];

const EventDetail = () => {
  const { id } = useParams();
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [dataTab, setDataTab] = useState({ Participantes: null, Recursos: null, Alimentos: null });
  const [loadingTab, setLoadingTab] = useState(false);
  const [errorTab, setErrorTab] = useState('');
  const [showModal, setShowModal] = useState(false);


  // Carga detalles generales
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/events/${id}`);
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [API_URL, id]);

  // Carga datos de la pestaña activa
  useEffect(() => {
    const fetchTabData = async () => {
      if (dataTab[activeTab] != null) return;
      setLoadingTab(true);
      setErrorTab('');

      let url = '';
      switch (activeTab) {
        case 'Participantes':
          url = `${API_URL}/participants/event/${id}`;
          break;
        case 'Recursos':
          url = `${API_URL}/events/${id}/resources`;
          break;
        case 'Alimentos':
          url = `${API_URL}/events/${id}/food`;
          break;
        default:
          return;
      }

      try {
        const { data } = await axios.get(url);
        setDataTab(prev => ({ ...prev, [activeTab]: data }));
      } catch (err) {
        setErrorTab(err.message);
      } finally {
        setLoadingTab(false);
      }
    };
    fetchTabData();
  }, [activeTab, API_URL, id, dataTab]);

  if (loading) return <p className="text-center py-10">Cargando...</p>;
  if (error) return <p className="text-center py-10 text-red-500">Error: {error}</p>;
  if (!event) return <p className="text-center py-10">Evento no encontrado</p>;

  // Formateo fechas
  const start = new Date(event.start_time);
  const end = new Date(event.end_time);
  const fecha = start.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  const horario = `${start.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })} – ${end.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`;

  const confirmDeleteEvent = async () => {
    try {
      await axios.delete(`${API_URL}/events/${id}`);
      Swal.fire({
        title: "Evento eliminado",
        text: "El evento ha sido eliminado correctamente.",
        icon: "success"
      }).then(() => {
        navigate('/dashboard/events');
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setShowModal(false); // Cierra el modal tras intento
    }
  };
  
  const handleDeleteEvent = async () => {
    setShowModal(true);
  }

  const handleBIlling = () => {
    // Lógica para manejar la facturación
    navigate(`/dashboard/events/billing-event/${id}`);
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8">
        {/* Imagen */}
        <div className="col-span-12 lg:col-span-5 rounded-2xl overflow-hidden shadow-lg">
          <img
            src={event.image_url[0]}
            alt={event.event_name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Detalles generales */}
        <div className="col-span-12 lg:col-span-7 p-8  flex flex-col justify-between">
          <div>
            <h1 className={`inline-block px-4 py-1 mb-5 rounded-full font-medium ${event.state === 'En curso' ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'
              }`}>
              {event.state}
            </h1>
            <h1 className="text-4xl font-semibold text-gray-900">{event.event_name}</h1>
            <p className="text-gray-500 mt-2">{event.category_name}</p>

            <ul className="mt-6 space-y-4">
              <li className="flex items-start text-gray-700">
                <FiCalendar size={24} className="text-indigo-500 mr-3" />
                <div>
                  <p className="font-medium">{fecha}</p>
                  <p className="text-sm text-gray-400">{horario}</p>
                </div>
              </li>
              <li className="flex items-start text-gray-700">
                <FiMapPin size={24} className="text-indigo-500 mr-3" />
                <div>
                  <p className="font-medium">{event.location_name}</p>
                  <p className="text-sm text-gray-400">{event.location_address}</p>
                </div>
              </li>
              <li className="flex items-start text-gray-700">
                <FiTablet size={24} className="text-indigo-500 mr-3" />
                <div>
                  <p className="font-medium">Modalidad – {event.event_type}</p>
                  {event.video_conference_link ? (
                    <a
                      href={event.video_conference_link}
                      className="text-sm text-indigo-500 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >Unirse a la videoconferencia</a>
                  ) : (
                    <p className="text-sm text-gray-400">{event.event_type === 'Virtual' ? 'Enlace no disponible' : 'Presencial'}</p>
                  )}
                </div>
              </li>
              <li className="flex items-start text-gray-700">
                <FiUsers size={24} className="text-indigo-500 mr-3" />
                <div><p className="font-medium">Max. Participantes: {event.max_participants}</p></div>
              </li>
            </ul>
          </div>
          <button className="mt-8 self-start px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition">
            Editar Ajustes
          </button>
        </div>

        {/* Descripción y Tabs */}
        <div className="col-span-12 mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Descripción</h2>
          <p className="text-gray-600 leading-relaxed mb-8">{event.event_type_description || 'No hay descripción disponible.'}</p>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex justify-center space-x-12" aria-label="Tabs">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 border-b-2 font-medium text-lg focus:outline-none ${activeTab === tab ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}>
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Contenido de la pestaña */}
          {loadingTab ? (
            <p className="text-center py-10">Cargando {activeTab.toLowerCase()}...</p>
          ) : errorTab ? (
            <p className="text-center py-10 text-red-500">Error: {errorTab}</p>
          ) : (
            <>
              {activeTab === 'Participantes' && dataTab.Participantes && (
                <>
                  {/* Resumen de estados */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center">
                      <FiCheckCircle className="text-indigo-600 mr-2" />
                      <span className="text-gray-700">Confirmados {dataTab.Participantes.filter(u => u.status_name === 'confirmado').length}</span>
                    </div>
                    <div className="flex items-center">
                      <FiClock className="text-indigo-600 mr-2" />
                      <span className="text-gray-700">Pendientes {dataTab.Participantes.filter(u => u.status_name === 'pendiente').length}</span>
                    </div>
                    <div className="flex items-center">
                      <FiUser className="text-gray-500 mr-2" />
                      <span className="text-gray-700">Asistió {dataTab.Participantes.filter(u => u.status_name).length}</span>
                    </div>
                    <div className="flex items-center">
                      <FiXCircle className="text-gray-600 mr-2" />
                      <span className="text-gray-700">Cancelado {dataTab.Participantes.filter(u => u.status_name === 'cancelado').length}</span>
                    </div>
                  </div>
                  {/* Listado */}
                  <div className="space-y-4">
                    {dataTab.Participantes.map(u => (
                      <div key={u.id} className="flex items-start bg-white p-4 rounded-lg shadow">
                        <FiUser size={32} className="text-gray-400 mr-4" />
                        <div className="flex flex-col">
                          <p className="font-semibold text-gray-900">{u.user_name + u.user_last_name}</p>
                          <p className="text-sm text-gray-500 mb-2">{u.email}</p>
                          <div className="flex items-center">
                            {u.status_name === 'confirmado' && <FiCheckCircle className="text-green-500 mr-1" />}
                            {u.status_name === 'pendiente' && <FiClock className="text-yellow-500 mr-1" />}
                            {u.status_name === 'cancelado' && <FiXCircle className="text-red-500 mr-1" />}
                            <span className="text-sm text-black font-semibold bg-gray-200 rounded-2xl px-3 py-1">{u.status_name}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <a href="" className='text-indigo-600 hover:underline font-semibold'>Ver todos</a>
                  </div>
                </>
              )}

              {/* Recursos y Comida siguen igual */}
              {activeTab === 'Recursos' && dataTab.Recursos && (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <a href="#" className="text-indigo-600 hover:underline font-semibold">Ver todos los recursos</a>
                    <button className="bg-indigo-600 text-white p-2 rounded-full shadow hover:bg-indigo-700 focus:outline-none"><FiPlus size={24} /></button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dataTab.Recursos.map(r => (
                      <div key={r.id} className="bg-white p-4 rounded-lg shadow flex justify-between">
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">{r.name}</p>
                          <p className="text-sm text-gray-500">{r.quantity_available} unidades</p>
                          <p className="text-sm text-gray-500">{r.description}</p>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <p className="font-semibold text-indigo-600 flex items-center">
                            <FiDollarSign className="mr-1" />{Number(r.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}

                  </div>
                </>
              )}

              {activeTab === 'Alimentos' && dataTab.Alimentos && (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <a href="#" className="text-indigo-600 hover:underline font-semibold">Ver todos los alimentos</a>
                    <button className="bg-indigo-600 text-white p-2 rounded-full shadow hover:bg-indigo-700 focus:outline-none"><FiPlus size={24} /></button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dataTab.Alimentos.map(f => (
                      <div key={f.id} className="bg-white p-4 rounded-lg shadow flex justify-between">
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">{f.name}</p>
                          <p className="text-sm text-gray-500">{f.quantity_available} unidades</p>
                          <p className="text-sm text-gray-500">{f.description}</p>
                        </div>
                        <p className="font-semibold text-indigo-600 flex items-center"><FiDollarSign className="mr-1" />{Number(f.price).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

            </>
          )}
        </div>
      </div>
      <div className="w-full flex gap-10 items-center justify-center mt-10">
        <button className='bg-red-500 rounded-xl px-6 py-3 text-xl text-white' onClick={handleDeleteEvent}>Eliminar evento</button>
        <button className='bg-indigo-500 rounded-xl px-6 py-3 text-xl text-white' onClick={handleBIlling}>Facturación</button>
      </div>
      <ConfirmationModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDeleteEvent}
        message="¿Estás seguro de que deseas eliminar este evento?"
      />

    </div>

    
  );
};

export default EventDetail;
