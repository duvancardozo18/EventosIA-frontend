import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react"; // 👈 importa useRef
import Tabs from "./tab/tab";
import { useEditEventAPI } from "../../../hooks/useEditEventApi";
import { toast } from "react-toastify";
import useEditTabNavigation from "../../../hooks/useEditTabNavigation";

const EditEvent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const eventId = location.state?.eventId;
  const { getEventById } = useEditEventAPI();

  const {
    goToNextSection,
    goToPreviousSection,
    currentSection,
    sections,
    progress,
    markSectionAsCompleted,
    isSectionCompleted
  } = useEditTabNavigation(location.pathname.split("/").pop());

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasRedirectedRef = useRef(false); // 👈 nueva ref

  const organizeFormData = (data) => ({
    id_event: data.id_event,
    evento: {
      id_event: data.id_event,
      event_name: data.event_name,
      id_event_state: data.id_event_state,
      state: data.state,
      image_url: data.image_url,
      image: null,
      imagePreview: data.image_url?.[0] || "",
      user_id_created_by: data.user_id_created_by,
      user_name: data.user_name,
      user_last_name: data.user_last_name
    },
    tipoEvento: {
      id_type_of_event: data.id_type_of_event,
      id_category: data.id_category,
      category_name: data.category_name,
      event_type: data.event_type,
      event_type_description: data.event_type_description,
      max_participants: data.max_participants,
      event_price: data.event_price,
      video_conference_link: data.video_conference_link || "",
      start_time: data.start_time,
      end_time: data.end_time
    },
    ubicacion: {
      id_location: data.id_location,
      location_name: data.location_name,
      location_description: data.location_description,
      location_address: data.location_address,
      location_price: data.location_price
    }
  });

const hasLoadedRef = useRef(false);

useEffect(() => {
  const loadEvent = async () => {
    if (!eventId) {
      toast.error("ID de evento no proporcionado");
      navigate("/dashboard/events");
      return;
    }

    try {
      const data = await getEventById(eventId);
      const organizedData = organizeFormData(data);
      console.log("🧾 Datos organizados desde organizeFormData:", organizedData); // 👈 aqu
      setFormData(organizedData);

      const initialCompletedSections = {
        editarEvento: true,
        editarTipoEvento: !!data.id_type_of_event,
        editarUbicacion: !!data.id_location
      };

      sessionStorage.setItem('editCompletedSections', JSON.stringify(initialCompletedSections));
      sessionStorage.setItem('currentEditEvent', JSON.stringify({ id: eventId }));

      if (location.pathname === "/dashboard/events/edit-event" && !hasLoadedRef.current) {
        hasLoadedRef.current = true;
        navigate(sections[0].path, { state: { eventId } });
      }

    } catch (error) {
      toast.error("No se pudo cargar el evento para edición");
      navigate("/dashboard/events");
    } finally {
      setLoading(false);
    }
  };

  if (!hasLoadedRef.current) {
    hasLoadedRef.current = true;
    loadEvent();
  }
}, [eventId]); // ✅ solo depende de `eventId`


  const updateFormData = (section, updatedFields) => {
    setFormData((prev) => {
      if (section && prev[section]) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            ...updatedFields
          }
        };
      } else {
        return {
          ...prev,
          ...updatedFields
        };
      }
    });
  };

  const handleNextSection = () => {
    markSectionAsCompleted();

    const currentIndex = sections.findIndex(s => s.id === currentSection?.id);
    const isLast = currentIndex === sections.length - 1;

    if (!isLast) {
      goToNextSection();
    }
  };

  if (loading || !formData) return <div className="p-4">Cargando datos del evento...</div>;

  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="sticky top-0 z-10 bg-white shadow-md p-4">
        <Tabs
          sections={sections}
          currentPath={location.pathname.split("/").pop()}
          completedSections={sections.reduce((acc, section) => {
            acc[section.id] = isSectionCompleted(section.id);
            return acc;
          }, {})}
          progress={progress}
        />
      </div>

      <div className="flex-grow p-4">
        <Outlet
          context={{
            formData,
            eventId,
            updateFormData,
            markSectionCompleted: markSectionAsCompleted,
            goToPreviousSection,
            goToNextSection: handleNextSection,
            currentSection: currentSection?.id,
            progress
          }}
        />
      </div>
    </div>
  );
};

export default EditEvent;