import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { Container } from '@mui/material';

import { api } from '../constants/api';

export default function Calendar() {
  const [RenamedEvent, setRenameEvent] = useState([]);

  function getTrainings() {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(api.trainings, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const events = result?.map(({ id, activity: title, customer, date }) => ({
          id,
          date,
          title,
          customer,
          display: 'block',
          color: '#3788d8',
        }));

        setRenameEvent(events);
      })
      .catch((error) => console.log('error', error));
  }

  useEffect(() => {
    getTrainings();
  }, []);

  const renderEventContent = (eventInfo) => {
    return (
      <div>
        <i>{eventInfo?.event?.title}</i>
        <i>
          / {eventInfo.event?.extendedProps?.customer?.firstname} {eventInfo.event?.extendedProps?.customer?.lastname}
        </i>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title> Calendar </title>
      </Helmet>

      <Container>
        <FullCalendar
          themeSystem="bootstrap5"
          plugins={[dayGridPlugin, timeGridPlugin, bootstrap5Plugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          initialView="dayGridMonth"
          events={RenamedEvent}
          eventContent={renderEventContent}
        />
      </Container>
    </>
  );
}
