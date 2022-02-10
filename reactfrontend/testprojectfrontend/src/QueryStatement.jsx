import { useState } from "react";

const QueryStatement = (props) => {


    const [isNumericAttr, setIsNumericAttr] = useState(false);


    const [secondCondition, setSecondCondition] = useState(false);


    const numericFields = ['datecreated', 'datemodified'];

    const handleAttrChange = (event) => {
        const {name, value} = event.target;

        if (!numericFields.includes(value)) {
            setIsNumericAttr(false);
        }
        else {
            setIsNumericAttr(true);
        }

    };

    const handleChecked = (event) => {

        setSecondCondition(oldVal => !oldVal);

    };

    const hideLabelStyle = {
        opacity: 0,
        transform: 'scale(0.01)'
    }


    return (<div className={props.isChainedStatement ? 'chained queryRow' : 'queryRow'}>
    {props.isChainedStatement ? <>

    <input id="secondCond"  onChange={handleChecked} type="checkbox" name="toggleCondition" className="toggleCondition"></input>

    <select disabled={!secondCondition}>                
        <option value="and">and</option>
        <option value="or">or</option>
    </select>

    <select disabled={!secondCondition} onChange={handleAttrChange}>
    <option value="author">Author</option>
    <option value="content">Content</option>
    <option value="datecreated">Date Created</option>
    <option value="datemodified">Date Modified</option>
    </select>
    <select disabled={!secondCondition}>
    <option value="equals">is equal to</option>
    <option value="notequals">is not equal to</option>
    <option value="contains">contains</option>
    {isNumericAttr && <>
    <option value="lessthan">is less than</option>
    <option value="lessthanequals">is less than or equal to</option>
    <option value="greaterthan">is greater than</option>
    <option value="greaterthanequals">is greater than or equal to</option>
    </>}
    </select> 
    <input disabled={!secondCondition} type='text'></input>
    <label style={secondCondition ? hideLabelStyle : {}} htmlFor="secondCond">use 2nd condition</label>
    </> : <>

    <select onChange={handleAttrChange}>
    <option value="author">Author</option>
    <option value="content">Content</option>
    <option value="datecreated">Date Created</option>
    <option value="datemodified">Date Modified</option>
    </select>
    <select >
    <option value="equals">is equal to</option>
    <option value="notequals">is not equal to</option>
    <option value="contains">contains</option>
    {isNumericAttr && <>
    <option value="lessthan">is less than</option>
    <option value="lessthanequals">is less than or equal to</option>
    <option value="greaterthan">is greater than</option>
    <option value="greaterthanequals">is greater than or equal to</option>
    </>}
    </select> 
    <input type='text'></input>
    </>}
  </div>)
};

export default QueryStatement;