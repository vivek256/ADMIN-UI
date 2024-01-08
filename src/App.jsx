import { useState, useRef } from "react";
import data from "./data";
import "./App.css";

function App() {
  const [modfiedList, setModfiedList] = useState([...data]); // This is for handling adminList after deletion of data in searched results
  const [adminList, setAdminList] = useState([...data]);
  const [pagingData, setPagingData] = useState({ initial: 0, final: 10 });
  const [currPageLimit, setCurrPageLimit] = useState({ i: 1, f: 5 });
  const [currPage, setCurrPage] = useState(1);
  const [deletingItems, setDeletingItems] = useState([]);
  const [editingItems, setEditingItems] = useState({});
  const [editData, setEditData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [state, setState] = useState(false);

  const highestLim = Math.ceil(adminList.length / 10);

  const elementRefs = Array.from({ length: 10 }, () => useRef(null));
  let selectALLRef = useRef(null);


  var i = 0;


  
  const range = Array.from(
    { length: currPageLimit.f - currPageLimit.i + 1 },
    (_, index) =>
      currPageLimit.i + index <= highestLim ? currPageLimit.i + index : null
  ); // For Creating array of numbers e.g[1,2,3,4]

  function handleSearch(e) {
    if (e.key === "Enter") {
      switch (searchValue) {
        case "":
          setAdminList([...modfiedList]);
          setState(false);
          break;

        default:
          const checkingData = state ? modfiedList : adminList;
          const newItems = checkingData.filter((val) => {
            let searchedValue = searchValue.toLowerCase().split(" ");
            let count = 0;

            for (var searchVal of searchedValue) {
              if (searchVal === " ") {
                continue;
              }

              if (val.name.toLowerCase().includes(searchVal)) {
                count++;
              } else if (val.email.toLowerCase().includes(searchVal)) {
                count++;
              } else if (val.role.toLowerCase().includes(searchVal)) {
                count++;
              }
            }

            if (count === searchedValue.length && searchedValue.length !== 0) {
              return true;
            }

            return false;
          });
          setState(true);
          setPagingData({ initial: 0, final: 10 }); //to show from first page if query is done in other next pages
          setCurrPage(1);
          setAdminList([...newItems]);
          break;
      }
    }
  }

  function deleteSelected(id, info) {
    const checkingData = state ? modfiedList : adminList;

    if (info === "side-delete") {
      for (const x in checkingData) {
        if (checkingData[x].id === id) {
          checkingData.splice(x, 1);
          break;
        }
      }

      for (const x in deletingItems) {
        if (deletingItems[x] === id) {
          deletingItems.splice(x, 1);
          break;
        }
      }
      setModfiedList([...checkingData]);
      setAdminList([...checkingData]);
    } else {
      const arr = [...checkingData];

      for (const x of deletingItems) {
        for (const y in arr) {
          if (x === arr[y].id) {
            arr.splice(y, 1);
            break;
          }
        }
      }
      setDeletingItems([]);

      selectALLRef.current.checked = false;

      setModfiedList([...arr]);

      setAdminList([...arr]);
    }

    setState(false);
    setSearchValue("");
  }




  function Edit(id, e) {
    if (isEditing) {
      const arr = [...adminList];
      for (const x in arr) {
        if (arr[x].id === editData.id) {
          !editData.name ? null : (arr[x].name = editData.name);
          !editData.email ? null : (arr[x].email = editData.email);
          !editData.role ? null : (arr[x].role = editData.role);
          break;
        }
      }
      setAdminList([...arr]);

      setEditData({});
    }

    setIsEditing(!isEditing);

    if (e.target.textContent === "Edit") {
      setEditingItems({ id: id, edit: e.target.textContent });
    } else if (e.target.textContent === "Done Edit") {
      setEditingItems({});
      setSearchValue("");
    }
  }





  function Editvalue(e, id) {
    const key = e.target.name,
      value = e.target.value;

    editData[key] = value;
    editData["id"] = id;

    setEditData({ ...editData });
  }

  function handleSelectAll(e) {
    const isChecked = e.target.checked;

    elementRefs.forEach((ref, index) => {
      if (ref.current !== null) {
        ref.current.checked = isChecked;
      }
    });

    if (isChecked) {
      const deletingList = adminList.slice(0, 10).map((v) => v.id);
      setDeletingItems([...deletingList]);
    } else {
      setDeletingItems([]);
    }
  }



  function handleCheckbox(isChecked, id) {
    selectALLRef.current.checked = false;

    switch (isChecked) {
      case true:
        setDeletingItems([...deletingItems, id]);
        break;

      case false:
        for (const x in deletingItems) {
          if (deletingItems[x] === id) {
            deletingItems.splice(x, 1);
            break;
          }
        }
        setDeletingItems([...deletingItems]);
        break;

      default:
        break;
    }
  }




  function setPaging(toDo) {
    switch (toDo) {
      case "next":
        if (pagingData.final < highestLim * 10) {
          selectALLRef.current.checked = false; // Put here highestLim x No. Of Data in One page
          setPagingData((prev) => ({
            initial: prev.initial + 10,
            final: prev.final + 10,
          })); // No. Of data in one page is 10
          if (currPage === currPageLimit.f) {
            setCurrPage(currPageLimit.i + 5); // No. of page indexes below to be displayed in curr page is 5
            setCurrPageLimit((prev) => ({ i: prev.i + 5, f: prev.f + 5 })); // No. of page indexes below to be displayed in curr page is 5
          } else {
            setCurrPage(currPage + 1);
          }
        }
        break;

      case "prev":
        if (pagingData.initial > 0) {
          selectALLRef.current.checked = false;
          setPagingData((prev) => ({
            initial: prev.initial - 10,
            final: prev.final - 10,
          })); // No. Of data in one page is 10
          if (currPage === currPageLimit.i) {
            setCurrPage(currPageLimit.i - 1);
            setCurrPageLimit((prev) => ({
              i: prev.i - 2 < 1 ? 1 : prev.i - 5,
              f: prev.f - 5,
            })); // No. of page indexes below to be displayed in curr page is 5
          } else {
            setCurrPage(currPage - 1);
          }
        }
        break;

      case "first":
        if (currPage !== 1) {
          selectALLRef.current.checked = false;
          setPagingData((prev) => ({ initial: 0, final: 10 })); // No. Of data in one page is 10
          setCurrPageLimit({ i: 1, f: 5 }); // No. of page indexes below to be displayed in curr page is 5

          setCurrPage(1);
        }

        break;

      case "last":
        if (currPage < highestLim) {
          selectALLRef.current.checked = false;
          setPagingData((prev) => ({
            initial: highestLim * 10 - 10,
            final: highestLim * 10,
          })); // No. Of data in one page is 10
          if (highestLim % 5 !== 0) {
            setCurrPageLimit((prev) => ({
              i: highestLim + 1 - (highestLim % 5),
              f: highestLim + 1,
            })); // No. of pages below to be displayed in curr page is 5
          } else {
            setCurrPageLimit((prev) => ({
              i: highestLim - 5 + 1,
              f: highestLim,
            })); // No. of pages below to be displayed in curr page is 5
          }
          setCurrPage(highestLim);
        }

        break;

      default:
    }
  }


  

  return (
    <>
      <div id="search-container">
        <input
          type="search"
          placeholder="Search..."
          autocomplete="off"
          id="mySearch"
          name="q"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
          onKeyDown={handleSearch}
        />
      </div>
      <table style={{ textAlign: "left" }}>
        <tr>
          <th>
            <input
              type="checkbox"
              ref={selectALLRef}
              onChange={handleSelectAll}
            />
          </th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
        {adminList.slice(pagingData.initial, pagingData.final)?.map((val) => (
          <tr key={val.id}>
            <td>
              <input
                type="checkbox"
                ref={elementRefs[i++]}
                onClick={(e) => handleCheckbox(e.target.checked, val.id)}
              />
            </td>
            <td>
              {editingItems.id === val.id ? (
                <input
                  defaultValue={val.name}
                  name="name"
                  onChange={(e) => Editvalue(e, val.id)}
                />
              ) : (
                val.name
              )}
            </td>
            <td>
              {editingItems.id === val.id ? (
                <input
                  defaultValue={val.email}
                  name="email"
                  onChange={(e) => Editvalue(e, val.id)}
                />
              ) : (
                val.email
              )}
            </td>
            <td>
              {editingItems.id === val.id ? (
                <input
                  defaultValue={val.role}
                  name="role"
                  onChange={(e) => Editvalue(e, val.id)}
                />
              ) : (
                val.role
              )}
            </td>
            <td>
              {editingItems.id === val.id ? (
                <button className="action" onClick={(e) => Edit(val.id, e)}>
                  Done Edit
                </button>
              ) : (
                <button className="action" onClick={(e) => Edit(val.id, e)}>
                  Edit
                </button>
              )}

              <button
                className="action"
                onClick={() => deleteSelected(val.id, "side-delete")}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </table>
      <div className="paging">
        <button className="bottom-delete-button" onClick={deleteSelected}>
          Delete Selected
        </button>
        <div>
          <button onClick={() => setPaging("first")}>&lt;&lt;</button>
          <button onClick={() => setPaging("prev")}>&lt;</button>
          {range.map((v) => (
            <li
              style={{
                backgroundColor: currPage === v && "black",
                color: currPage === v && "white",
                width: "15px",
                display: "inline-block",
                margin: "0 10px",
              }}
            >
              {v}
            </li>
          ))}
          <button onClick={() => setPaging("next")}>&gt;</button>
          <button onClick={() => setPaging("last")}>&gt;&gt;</button>
        </div>
      </div>
    </>
  );
}

export default App;
