import {Link, useParams} from "react-router-dom";
import React from "react";

const ProjectItem = ({project}) => {
    return (
        <tr>
            <td><Link to={`/project/${project.uid}`}>{project.name}</Link></td>
            <td>{project.repository}</td>
        </tr>
    )
}

const ProjectList = ({projects}) => {
    return (
        <table className="table mt-2">
            <thead>
                <tr>
                    <th>Название</th>
                    <th>Репозиторий</th>
                </tr>
            </thead>
            <tbody>
                {projects.map((project, i) => <ProjectItem project={project} key={i}/>)}
            </tbody>
        </table>
    )
}

const ProjectInfo = ({projects}) => {
    const {uid} = useParams();
    const project = projects.find((item) => item.uid === uid);
    if(!project) {
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
                Репозиторий: <a href={project.repository} target="_blank">{project.repository}</a>
            </div>
            <div className="mt-2">
                Пользователи:
                {project.users.map((user) => `${user.firstName} ${user.lastName}`).join(', ')}
            </div>

        </div>
    )
}

export {ProjectList, ProjectInfo}