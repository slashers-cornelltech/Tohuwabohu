import React, { Component } from 'react';
import './App.css';
import Playlist from './components/Playlist';
import Preview from './components/Preview';
// import TestFs from './TestFs.ts';
import DragAndDrop from './components/DragAndDrop';
import GlobalDrawArea from './components/GlobalDrawArea';
import Audio from './components/Audio';

class App extends Component {

	constructor(props) {
		super(props);

		// deprecated: fetch data from json file 
		// let data = [{ id: 10, name: 'outside file', url: '/Users/sjx/Pictures/2001_A_Space_Odyssey_1.jpg', type: 'img' }]
		// const files_json = TestFs.getDirectoryListing()
		// console.log('[files_json]', files_json)
		// const files_name = files_json.slice(4, -2).split(',\n  ')

		// files_name.forEach((file, index) => {
		// 	file = file.slice(1, -1)
		// 	if (file.endsWith('.png')) {
		// 		data.push({ id: index, name: file, url: './asset/' + file, type: 'img' })
		// 	} else if (file.endsWith('.mp4') || file.endsWith('.mp3')) {
		// 		data.push({ id: index, name: file, url: './asset/' + file, type: 'av' })
		// 	}
		// })

		// desktop
		// let data = JSON.parse(localStorage.getItem('files'))
		// if (data.length === 0) {
		// 	data = [{ id: 10, name: 'cave', url: './asset/cave.jpg', type: 'img' },
		// 	{ id: 20, name: 'cant lose cant lose cant lose cant lose', url: './asset/break_it_to_me.png', type: 'img' }]
		// }

		// web 
		const data = [{ id: 10, name: 'cave', url: './asset/cave.jpg', type: 'img', text: '' },
		{ id: 20, name: 'vid', url: './asset/JavaScript.mp4', type: 'av', text: '' }, 
		{ id: 30, name: 'hiya', url: './asset/hiya.md', type: 'md', text: 'hiya' }]

		this.state = {
			data: data || [],
			selectedIndex: [],
			id2index: { 10: 0, 20: 1, 30: 2 },
			index2id: { 0: 10, 1: 20, 2: 30 },
			showList: true,
			showZone: true,
			showGlobalCanvas: false
		}
		console.log('[START]', this.state)
	}


	/* DROPZONE */
	addFiles = (files) => {
		let data = this.state.data;
		let len = this.state.data.length;

		for (var i = 0; i < files.length; i++) {
			let type = '';
			let newData = { id: len, name: files[i].name, url: files[i].path, type: type, text: '' };
			if (files[i].name.endsWith(".jpg") || files[i].name.endsWith(".png") || files[i].name.endsWith(".gif") || files[i].name.endsWith(".bmp")) {
				newData.type = 'img';
			} else if (files[i].name.endsWith(".md") || files[i].name.endsWith(".txt")) {
				newData.type = 'md';
				files[i].text().then(result => newData.text = result);
			} else if (files[i].name.endsWith(".mp3") || files[i].name.endsWith(".mp4") || files[i].name.endsWith(".webm")) {
				newData.type = 'av';
			} else {
				// file type not supported
			}
			
			data.push(newData);
			len += 1
			console.log('[addFiles]', newData.url, newData.text);
		}

		localStorage.setItem('files', JSON.stringify(data));
		this.setState({ data: data })
	}

	clearLS = () => {
		localStorage.clear();
		// localStorage.setItem('files', '')
		this.setState({ data: [], selectedIndex: [] })
	}

	deleteFromLS = id => event => {
		console.log('[deleteFromLS]')
		if (this.state.selectedIndex.length > 0) {
			console.log('disabled when showing preview!')
		} else {
			// let selectedArr = this.state.selectedIndex
			let data = this.state.data
			let id2index = this.state.id2index
			let index2id = {}
			const index = id2index[id]

			delete id2index[id]
			for (var key in id2index) {
				if (id2index[key] > index) {
					id2index[key]--
				}
			}
			for (var key in id2index) {
				index2id[id2index[key]] = key
			}

			data.splice(index, 1)
			// selectedArr.splice(index, 1)
			// selectedArr.forEach((selected, i) => {
			// 	if (selected > index) {
			// 		selectedArr[i]--
			// 	}
			// })

			// this.setState({ data: data, selectedIndex: [...selectedArr], id2index: id2index, index2id: index2id })
			this.setState({ data: data, id2index: id2index, index2id: index2id })
			localStorage.setItem('files', JSON.stringify(data))
		}
	}

	toggleZone = () => {
		this.setState({ showZone: !this.state.showZone })
	}
	/* END DROPZONE */


	/* PLAYLIST */
	changeSelection = clickedID => event => {
		console.log('[changeSelection]', event.shiftKey, 'item.id:', clickedID)
		const clickedIndex = this.state.id2index[clickedID]
		let selectedIndex = [...this.state.selectedIndex]
		let selectedID = []
		selectedIndex.forEach((index, i) => {
			selectedID.push(this.state.index2id[index])
		})
		if (!selectedID.includes(clickedID)) {
			if (event.shiftKey) {
				selectedIndex.push(clickedIndex)
			} else {
				selectedIndex = [clickedIndex]
			}
		} else {
			if (event.shiftKey) {
				selectedIndex.splice(selectedIndex.indexOf(clickedIndex), 1)
			} else {
				selectedIndex = []
			}
		}

		this.setState({ selectedIndex: [...selectedIndex] }, () => { console.log('[changeSelection:callback]', this.state.selectedIndex) }) // so only after render, it reset the states
		console.log('[changeSelection:selectedIndex]', this.state.selectedIndex)
	}

	updateSortable = (newState) => {
		let newId2index = {}
		let newIndex2id = {}
		let newSelectedIndex = []
		let selectedId = []

		// get currently selected items' id
		this.state.selectedIndex.forEach((selected, i) => {
			selectedId.push(this.state.index2id[selected])
		})

		// update the relationship dicts
		newState.forEach((item, index) => {
			newId2index[item.id] = index
			newIndex2id[index] = item.id
		})

		// map current selected item ids to new index 
		selectedId.forEach((selected, i) => {
			newSelectedIndex.push(newId2index[selected])
		})

		this.setState({ data: newState, id2index: newId2index, index2id: newIndex2id, selectedIndex: newSelectedIndex })
	}

	toggleList = () => {
		this.setState({ showList: !this.state.showList })
	}
	/* END PLAYLIST */


	/* PREVIEW */
	prevNext = direction => event => {
		if (this.state.selectedIndex.length === 1) {
			direction === 'prev' ?
				this.setState({ selectedIndex: this.state.selectedIndex[0] === 0 ? [this.state.data.length - 1] : [this.state.selectedIndex[0] - 1] }) :
				this.setState({ selectedIndex: this.state.selectedIndex[0] === this.state.data.length - 1 ? [0] : [this.state.selectedIndex[0] + 1] })
		} else {
			console.log('Prev/next is disabled when multiselection!')
		}
		console.log(this.state.selectedIndex)
	}

	clearPreview = () => {
		this.setState({ selectedIndex: [] })
	}

	toggleGlobalCanvas = () => {
		this.setState({ showGlobalCanvas: !this.state.showGlobalCanvas })
	}
	/* END PREVIEW */

	changeEditorFilename = (id, newFilename, newText) => {
		let data = this.state.data;
		data[this.state.id2index[id]].name = newFilename;
		data[this.state.id2index[id]].text = newText;
		this.setState({ data: data });
	}

	render() {
		console.log('[render]', this.state.data.length)
		return (
			/* CONTAINER */
			<div>
				{/* METADATA ROW */}
				<div className="metadata">
					<div className='audio'><Audio /></div>

					<div className='dropzone'>
						{
							this.state.showZone &&
							<DragAndDrop handleDrop={this.addFiles}>
								{/* <div style={{ position: 'absolute', top: 0, botton: 0, left: 0, right: 0, textAlign: 'center', color: 'salmon', fontSize: 24 }} >Drop Zone</div> */}
							</DragAndDrop>
						}
						<button className="action" onClick={this.toggleZone}>{this.state.showZone ? 'HIDE' : 'SHOW'}</button>
					</div>

					<div className='playlist'>
						{
							this.state.showList &&
							<Playlist data={this.state.data} selectedIndex={this.state.selectedIndex} updated={this.updateSortable} clicked={this.changeSelection} clickDeleted={this.deleteFromLS} />
						}
						<button className="action" onClick={this.toggleList}>{this.state.showList ? 'HIDE' : 'SHOW'}</button>
						<button className="delete" onClick={this.clearLS}>CLEAR PLAYLIST</button>
					</div>
				</div>

				{/* PREVIEWS */}
				<button className="action" onClick={this.toggleGlobalCanvas}>GLOBAL CANVAS</button>
				{this.state.showGlobalCanvas && <GlobalDrawArea canvasWidth={window.innerWidth} canvasHeight={window.innerHeight} />}

				<div className='preview'>
					<button className="action" onClick={this.prevNext('prev')}>PREV</button>
					<button className="action" onClick={this.prevNext('next')}>NEXT</button>
					<button className="delete" onClick={this.clearPreview}>CLEAR PREVIEW</button>
					
					<Preview data={this.state.data} selectedIndex={this.state.selectedIndex} changeEditorFilenameFn={this.changeEditorFilename}/>
				</div>
			</div>
		)

	}
}

export default App;
