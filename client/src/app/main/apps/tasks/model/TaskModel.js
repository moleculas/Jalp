import _ from '@lodash';

const TaskModel = (data) =>
  _.defaults(data || {}, {
    type: 'task',
    title: '',
    notes: '',
    completed: false,
    dueDate: null,
    priority: 0,
    asignadaA: [],
    creadaPor: null,
    order: 1,
  });

export default TaskModel;
