import Multiselect from 'multiselect-react-dropdown';
import { useState } from 'react';
import { getLists } from './script';
import {Table} from './table.js'
export const Form = () => {
    const [handle, setHandle] = useState('');
    const [friendHandle, setfriendHandle] = useState('');
    const [tags, setTags] = useState([]); // tags is an array of strings
    const [active, setActive] = useState(0);
    const [list, setList] = useState([]);
    const [ErrorMessage, SetErrorMessage] = useState('');
    const separateTags = (tags) => {
        let tagString = '';
        tags.forEach((tag, index) => {
            if (index === tags.length - 1) {
                tagString += tag;
            }
            else {
                tagString += tag + ', ';
            }
        })
        return tagString;
    }


    const ModifyList = (list) => {
        const modifiedList = list.map((item, index) => {
            const newItem = { '#': index + 1, 'name': item.name, 'tags': separateTags(item.tags), 'rating': item.rating, link: `https://codeforces.com/problemset/problem/${item.contestId}/${item.index}`};
            return newItem;
        })
        return modifiedList;
    }
    const onSubmit = () => {
        console.log(handle, friendHandle, tags)
        getLists(handle, friendHandle, tags).then((res) => {
            if (res.error) {
                setActive(0);
                SetErrorMessage(res.error)
            }
            else {
                setActive(1);
                setList(ModifyList(res.friendSolved));
                SetErrorMessage('');
            }
        })
    }
    return (
        <div className='main-body'>
        <div className="form">
            <div className="left">
                <div className="inputs">
                    <div>
                        <input type="text" className="input-box" placeholder="Your Handle" onChange={(e) => {
                                setHandle(e.target.value)
                                setActive(0);
                        }} />
                    </div>
                    <div>
                        <input type="text" className="input-box" placeholder="Friend's Handle" onChange={(e) => {
                                setfriendHandle(e.target.value)
                                setActive(0);
                        }} />
                    </div>
                </div>
            </div>
                <div className="right">
                    <Multiselect
                        isObject={false}
                        onKeyPressFn={function noRefCheck() { }}
                        onRemove={(event) => {
                            setTags(event)
                        }}
                        onSearch={function noRefCheck() { }}
                        onSelect={(event) => {
                            setTags(event)
                        }}
                        placeholder="TAGS"
                        avoidHighlightFirstOption={true}
                        className="multi-select-styling"
                        options={[
                            // write only "option.value" string in this array
                            "2-sat",
                            "binary search",
                            "bitmasks",
                            "brute force",
                            "chinese remainder theorem",
                            "combinatorics",
                            "constructive algorithms",
                            "data structures",
                            "dfs and similar",
                            "divide and conquer",
                            "dp",
                            "dsu",
                            "expression parsing",
                            "fft",
                            "flows",
                            "games",
                            "geometry",
                            "graph matchings",
                            "graphs",
                            "greedy",
                            "hashing",
                            "implementation",
                            "interactive",
                            "math",
                            "matrices",
                            "meet-in-the-middle",
                            "number theory",
                            "probabilities",
                            "schedules",
                            "shortest paths",
                            "sortings",
                            "string suffix structures",
                            "strings",
                            "ternary search",
                            "trees",
                            "two pointers"
                        ]} // Options to display in the dropdown
                    />
                </div>
            </div>
            <button className="sub-button" onClick={onSubmit}>Submit</button>
            {active ? <Table list={list} /> : null}
            {!active && ErrorMessage ? <div className="error">{ErrorMessage}</div> : null}
        </div>
    )
}