import {Link, useParams} from "react-router-dom";
import React from "react";

const ProjectItem = ({project, deleteProject}) => {
    return (
        <tr>
            <td><Link to={`/project/${project.uid}`}>{project.name}</Link></td>
            <td><a href={project.repository} target="_blank">{project.repository}</a></td>
            <td>
                <button className="btn btn-danger"
                        onClick={(uid) => deleteProject(project.uid)}>
                    Удалить
                </button>
            </td>
        </tr>
    )
}

const ProjectList = ({projects, projectsFilters, deleteProject, searchProject}) => {
    return (
        <>
            <div className="mt-4 row">
                <div className="col">
                    <input placeholder="поиск проекта" className="form-control shadow-none"
                           value={projectsFilters.text}
                           onChange={(event) => searchProject(event)}/>
                </div>
                <div className="col text-right">
                    <Link to="/project/create/"><button className="btn btn-info float-right">Добавить проект</button></Link>
                </div>
            </div>
            <table className="table mt-2">
                <thead>
                    <tr>
                        <th>Название</th>
                        <th>Репозиторий</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project, i) => <ProjectItem project={project}
                                                               deleteProject={(uid) => deleteProject(uid)}
                                                               key={i}/>)}
                </tbody>
            </table>
        </>
    )
}

const ProjectInfo = ({getProject, project}) => {
    const {uid} = useParams();
    if(uid !== project.uid){
        getProject(uid);
    }
    if(project.name === undefined) {
        return (
            <div>
                <h4 className="mt-4 text-center">Проект не найден!</h4>
            </div>
        )
    }
    return (
        <div className="mt-4">
            <h4 className="text-center">{project.name}</h4>
            <div className="mt-2">
                Репозиторий: <a href={project.repository} target="_blank" rel="noreferrer">{project.repository}</a>
            </div>
            <div className="mt-2">
                Пользователи:
                {project.users.map((user) => `${user.firstName} ${user.lastName}`).join(', ')}
            </div>
        </div>
    )
}

export {ProjectList, ProjectInfo}