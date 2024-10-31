import React from "react";
import TaskCard from "../../../component/cards/TaskCard";
import { projects } from "../../../data/projects";
import Pagination from "../../../component/teams/Pagination";

function Projects() {
  return (
    <div
      className="tab-pane fade show active"
      id="tab_3"
      role="tabpanel"
      aria-labelledby="nav-home-tab"
    >
      {/* <!-- Task Area --> */}
      <div className="crancy-taskarea mg-top-30">
        <h3 className="crancy-taskarea__title m-0">Task Progress</h3>
        <div className="row">
          {projects?.map((task) => (
            <TaskCard task={task} key={task.id} />
          ))}
        </div>

        <Pagination />
      </div>
      {/* <!-- End Task Area --> */}
    </div>
  );
}

export default Projects;
