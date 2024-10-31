import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import daygridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";

function CalenderCom() {
  const date = new Date();
  const month =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  const [events, setEvents] = useState([
    {
      title: "Do App Design",
      start: `2023-${month}-10`,
      classNames: "event-color event-color__1",
      rule: "FREQ=MONTHLY;BYMONTHDAY=25",
    },
    {
      title: "DesignCarft Team Meeting",
      start: `2023-${month}-13`,
      classNames: "event-color event-color__2",
    },
    {
      title: "Clients USA Meeting",
      start: `2023-${month}-18`,
      classNames: "event-color event-color__3",
    },
    {
      title: "Join Online Party",
      start: `2023-${month}-23`,
      classNames: "event-color event-color__4",
    },
  ]);
  const handleSelect = (info) => {
    const eventNamePrompt = prompt("Enter, event name");
    if (eventNamePrompt) {
      setEvents([
        ...events,
        {
          ...info,
        },
      ]);
    }
  };
  return (
    <div className="col-xxl-8 col-xl-12 col-12 mg-top-30">
      <div className="crancy-calandere-main">
        <div className="crancy-default-cd crancy-default-cd__event ">
          <FullCalendar
            selectable
            select={handleSelect}
            plugins={[
              daygridPlugin,
              interactionPlugin,
              timeGridPlugin,
              listPlugin,
            ]}
            views={["dayGridDay", "timeGridMonth", "dayGridWeek"]}
            initialDate={new Date()} // using new Date(); and set your scheduled on event array
            navLinks={true} // can click day/week names to navigate views
            businessHours={true} // display business hours
            editable={false}
            headerToolbar={{
              left: "<span>Custom Text</span>",
              center: "title",
            }}
            dayMaxEvents={false} // allow "more" link when too many events
            events={events}
          />
        </div>
      </div>
    </div>
  );
}

export default CalenderCom;
