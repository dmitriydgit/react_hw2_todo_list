import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
import * as serviceWorker from './serviceWorker';


class TodoEditor extends React.Component {
	constructor(props) {
		super(props);
		this.handleTaskAdd = this.handleTaskAdd.bind(this);
	}

	handleTaskAdd(e) {
		if (e.keyCode === 13) {
			var newTask = {
				id: Date.now(),
				text: e.target.value,
				done: false
			}
			this.props.onTaskAdd(newTask);
			e.target.value = '';
		}
	}

	render() {
		return (
			<div className='tasks-editor'>
				<input type='text' placeholder='What do You need to do?' id='todo-field' onKeyUp={this.handleTaskAdd} />
			</div>
		)
	}
}

class Todo extends React.Component {
	constructor(props) {
		super(props);
		this.toggleTaskStatus = this.toggleTaskStatus.bind(this)
	}

	toggleTaskStatus(e) {
		var renewedTask = {
			id: this.props.id,
			text: this.props.children,
			done: e.target.checked
		}

		this.props.onChange(renewedTask);
	}

	render() {
		var style = this.props.done ? 'finished' : 'active';
		return (
			<div className='todo-list'>
				<input type='checkBox' onClick={this.toggleTaskStatus}></input>
				<span className={style}> {this.props.children}</span>
				<button onClick={this.props.onDelete}>x</button>

			</div>
		)
	}
}




class TodoGrid extends React.Component {

	//добавить в туду всплытие обьекnа с пропорти status:done и перенаправить в главный компонент, менять стиль в зависимости от этого свойтва, 

	render() {
		var onStatusChange = this.props.onStatusChange;
		var onDelete = this.props.onDelete;
		return (
			<div className="todo-tasks">
				{
					this.props.tasks.map(function (task) {
						return (
							<Todo
								key={task.id}
								id={task.id}
								done={task.done}
								onChange={onStatusChange.bind(null)}
								onDelete={onDelete.bind(null, task)}
							>
								{task.text}
							</Todo>
						);
					})
				}
			</div>
		)
	}
}


class TodoApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			todoTasks: [
				{
					id: 1,
					text: 'placeholder1',
					done: false
				},
				{
					id: 2,
					text: 'placeholder2',
					done: false
				},
				{
					id: 3,
					text: 'placeholder3',
					done: false
				},
				{
					id: 4,
					text: 'placeholder4',
					done: false
				}

			]
		}
		this.addTask = this.addTask.bind(this);
		this.changeTaskStatus = this.changeTaskStatus.bind(this);
		this.deleteTask = this.deleteTask.bind(this);

	}

	addTask(newTask) {

		var newTasks = this.state.todoTasks.slice();
		newTasks.push(newTask);
		this.setState(
			{
				todoTasks: newTasks
			}
		);
	}

	changeTaskStatus(renewedTask) {
		var newTasks = this.state.todoTasks.slice();
		var task = newTasks.findIndex(task => task.id === renewedTask.id);
		newTasks.splice(task, 1, renewedTask)
		this.setState({
			todoTasks: newTasks
		})

	}

	deleteTask(task) {
		console.log(task)
		var taskId = task.id;
		var newTasks = this.state.todoTasks.filter(function (task) {
			return task.id !== taskId;
		});
		this.setState({
			todoTasks: newTasks
		});
	}

	render() {
		return (
			<div className="main-frame">
				<TodoEditor onTaskAdd={this.addTask} />
				<TodoGrid
					tasks={this.state.todoTasks}
					onStatusChange={this.changeTaskStatus}
					onDelete={this.deleteTask}
				/>
				<div>
					<span>All</span>
					<span>New</span>
					<span>Completed</span>
				</div>

			</div>
		)
	}
}


/*
- добавить функционал для сохранения в локал сторедж
- добавить функционал фильтра 
- доработать верстку

*/






ReactDOM.render(<TodoApp />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
