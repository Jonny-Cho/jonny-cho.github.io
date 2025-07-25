import React from 'react';
import SectionHeader from '../section-header';
import IconButtonBar from '../icon-button-bar';
import Image from '../image';
import './style.scss';

function ProjectSection({ projects }) {
  if (!projects || projects.length < 2) return null;
  return (
    <div className="project-section flex-center">
      <SectionHeader title="Projects" />
      {projects.map((project, index) =>
        index === 0 ? null : (
          <div className="project" key={index}>
            <div className="head flex">
              {project.title}&nbsp;&nbsp;
              {project.links && (
                <IconButtonBar links={project.links} style={{ color: '#a8a8a8', fontSize: 24 }} />
              )}
            </div>
            <div className="body flex">
              <Image className="thumbnail" src={project.thumbnailUrl} />

              {project.techStack && (
                <div className="tech-stack flex">
                  {project.techStack.map((tech, index) => (
                    <div key={index} className="tech rounded-xl">
                      {tech}
                    </div>
                  ))}
                </div>
              )}
              <div className="description text-base">{project.description}</div>
            </div>
          </div>
        ),
      )}
    </div>
  );
}

export default ProjectSection;
