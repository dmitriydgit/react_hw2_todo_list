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
				<label className="checkbox-container">
					<input type='checkBox' onChange={this.toggleTaskStatus} checked={this.props.done} ></input>
					<span className="checkmark"></span>
				</label>
				<span className={style}> {this.props.children}</span>
				<button className='btn success' onClick={this.props.onDelete}>X</button>

			</div>
		)
	}
}


class TodoGrid extends React.Component {

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


class TodoFilters extends React.Component {
	render() {
		return (
			<div onClick={this.props.handleFilter} className='filter-frame'>
				<span id='filter-all' className={`filter ${this.props.activeFilter === 'filter-all' ? '' : 'filter-disabled'}`} onClick={this.props.addActiveClass}>All</span>
				<span id='filter-new' className={`filter ${this.props.activeFilter === 'filter-new' ? '' : 'filter-disabled'}`} onClick={this.props.addActiveClass}>New</span>
				<span id='filter-completed' className={`filter ${this.props.activeFilter === 'filter-completed' ? '' : 'filter-disabled'}`} onClick={this.props.addActiveClass}>Completed</span>
			</div>
		)
	}
}

class TodoApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			todoTasks: [],
			backupTasks: [],
			activeFilter: 'filter-all'
		}
		this.addTask = this.addTask.bind(this);
		this.changeTaskStatus = this.changeTaskStatus.bind(this);
		this.deleteTask = this.deleteTask.bind(this);
		this.handleFilter = this.handleFilter.bind(this);
		this.addActiveClass = this.addActiveClass.bind(this);

	}

	componentDidMount() {
		var localTasks = JSON.parse(localStorage.getItem('todoTasks'));
		if (localTasks) {
			this.setState({
				todoTasks: localTasks,
				backupTasks: localTasks
			});
		}
	};

	componentDidUpdate(prevProps, prevState) {
		this._updateLocalStorage();
	};

	addTask(newTask) {
		var newTasks = this.state.backupTasks.slice();
		newTasks.push(newTask);
		this.setState(
			{
				todoTasks: newTasks,
				backupTasks: newTasks,
				activeFilter: 'filter-all'
			}, this._updateLocalStorage()
		);

	}

	changeTaskStatus(renewedTask) {
		var newTasks = this.state.backupTasks.slice();
		var task = newTasks.findIndex(task => task.id === renewedTask.id);
		newTasks.splice(task, 1, renewedTask)
		this.setState({
			todoTasks: newTasks,
			backupTasks: newTasks
		}, this._updateLocalStorage())
	}

	deleteTask(task) {
		var taskId = task.id;
		var newTasks = this.state.backupTasks.filter(function (task) {
			return task.id !== taskId;
		});
		this.setState({
			todoTasks: newTasks,
			backupTasks: newTasks,
			activeFilter: 'filter-all'
		}, this._updateLocalStorage());
	}

	handleFilter(e) {
		var id = e.target.id;

		if (id === 'filter-all') {
			this.setState({
				todoTasks: this.state.backupTasks
			})
		}
		if (id === 'filter-new') {
			var searchedTasksNew = this.state.backupTasks.filter(function (task) {
				return task.done === false;
			})
			this.setState({
				todoTasks: searchedTasksNew
			})
		}
		if (id === 'filter-completed') {
			var searchedTasksCompleted = this.state.backupTasks.filter(function (task) {
				return task.done === true;
			})
			this.setState({
				todoTasks: searchedTasksCompleted
			})
		}
	}

	addActiveClass(e) {
		const clicked = e.target.id
		if (this.state.active === clicked) {
			return
		} else {
			this.setState({ activeFilter: clicked })
		}
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
				<TodoFilters
					handleFilter={this.handleFilter}
					activeFilter={this.state.activeFilter}
					addActiveClass={this.addActiveClass}
				/>
			</div>
		)
	}


	_updateLocalStorage() {
		var tasks = JSON.stringify(this.state.todoTasks);
		localStorage.setItem('todoTasks', tasks);
	}

}


/*



*/






ReactDOM.render(<TodoApp />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
