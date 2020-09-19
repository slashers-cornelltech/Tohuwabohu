import React from 'react';
import { ReactSortable } from "react-sortablejs";
import styled from 'styled-components';

const StyledListDiv = styled.div`
    flex-grow: 4;
    height: 500x;
    padding: 16px;
    text-align: center;
    border: 10px outset white;
    background-color: black;
    color: white;  
    font-family: Courier;
    &:hover {
        background-color: green;
    }
`;

const StyledDeleteButton = styled.div`
    flex-grow: 1;
    height: 500x;
    padding: 16px;
    text-align: center;
    border: 10px outset white;
    background-color: black;
    color: white;  
    font-family: Courier;
    &:hover {
        background-color: green;
    }
`;

const StyledActiveListDiv = styled.div`
    flex-grow: 4;
    height: 500x;
    padding: 16px;
    text-align: center;
    border: 10px inset white;
    background-color: white;
    color: black;  
    font-family: Courier;
    font-weight: bold;
    &:hover {
        background-color: red;
    }
`;

const StyledActiveDeleteButton = styled.div`
    flex-grow: 1;
    height: 500x;
    padding: 16px;
    text-align: center;
    border: 10px inset white;
    background-color: white;
    color: black;  
    font-family: Courier;
    font-weight: bold;
    &:hover {
        background-color: red;
    }
`;

const Playlist = (props) => {

    // const style = {
    //     width: '50%',
    //     maxWidth: '500px',
    //     margin: '16px',
    //     padding: '16px',
    //     textAlign: 'center',
    //     border: '10px outset white',
    //     backgroundColor: 'black',
    //     color: 'white'
    // }

    // const activeStyle = {
    //     width: '50%',
    //     maxWidth: '500px',
    //     margin: '16px',
    //     border: '10px inset white',
    //     padding: '16px',
    //     textAlign: 'center',
    //     backgroundColor: 'white',
    //     color: 'black',
    //     fontFamily: 'Courier',
    //     fontWeight: 'bold'
    // }


    return (
        <ReactSortable
            list={props.data}
            setList={props.updated}
        >
            {props.data.map((item, index) => {
                let isActive = props.selectedId.includes(index)
                return (
                    <div key={item.id} style={{ display: 'flex', flexDirection: 'row', maxWidth: '800px' }}>
                        {isActive ?
                            <StyledActiveListDiv onClick={props.clicked(index)}>{[item.name, item.id, index]}</StyledActiveListDiv>
                            : <StyledListDiv onClick={props.clicked(index)}>{[item.name, item.id, index]}</StyledListDiv>
                        }
                        {isActive ?
                            <StyledActiveDeleteButton onClick={props.clickDeleted(index)}>x</StyledActiveDeleteButton>
                            : <StyledDeleteButton onClick={props.clickDeleted(index)}>x</StyledDeleteButton>
                        }
                    </div>
                    // <tr>
                    //     <td style={isActive ? activeStyle : style} key={item.id} onClick={props.clicked(index)}>{[item.name, item.id, index]}</td>
                    //     <td style={isActive ? activeStyle : style} onClick={props.clickDeleted(index)}>x</td>
                    // </tr>
                )
            })}
        </ReactSortable>
    )
}

export default Playlist;
