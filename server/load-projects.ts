import {Projects} from '../collections/projects.collection.ts';

export function loadProjects() {
    if(Projects.find().count() === 0) {

        var projects = [
            {
                'title': 'Project1',
                'description': 'Description of project1',
                'risk_level': 'Medium'
            },
            {
                'title': 'Project2',
                'description': 'Description of project2',
                'risk_level': 'Low'
            },
            {
                'title': 'Project3',
                'description': 'Description of project3',
                'risk_level': 'Medium'
            },
            {
                'title': 'Project4',
                'description': 'Description of project4',
                'risk_level': 'High'
            }
        ];

        for(var i = 0; i < projects.length; i++) {
            Projects.insert(projects[i]);
        }
    }
}
