import FullCalendar from "@fullcalendar/react";
import daygridPlugin from "@fullcalendar/daygrid";

function CalenderSm() {
  return (
    <div className="col-xl-12 col-lg-6 col-md-6 col-12 crancy-sidebar__widget">
      <div className="crancy-sidebar__single">
        <div className="crancy-default-cd">
          <FullCalendar
            selectable={true}
            plugins={[daygridPlugin]}
            views={["dayGridDay"]}
            headerToolbar={{
              start: "title",
              end: "prev next",
            }}
            initialDate={new Date()} // using new Date(); and set your scheduled on event array
            businessHours={true} // display business hours
            editable={false}
          />
        </div>
      </div>
    </div>
  );
}

export default CalenderSm;
