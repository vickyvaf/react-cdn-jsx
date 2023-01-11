"use strict";
const initialState = {
  tag: "idle",
  searchInputValue: "",
  products: [],
  errorMsg: "",
};

function reducer(prevState, action) {
  switch (prevState.tag) {
    case "idle": {
      switch (action.type) {
        case "FETCH": {
          return {
            ...prevState,
            tag: "loading",
          };
        }
        default: {
          return prevState;
        }
      }
    }
    case "loading": {
      switch (action.type) {
        case "FETCH_SUCCESS": {
          return {
            ...prevState,
            tag: "loaded",
            products: action.payload,
            errorMsg: "",
          };
        }
        case "FETCH_EMPTY": {
          return {
            ...prevState,
            tag: "empty",
            products: [],
            errorMsg: "",
          };
        }
        case "FETCH_ERROR": {
          return {
            ...prevState,
            tag: "error",
            products: [],
            errorMsg: action.payload,
          };
        }
        default: {
          return prevState;
        }
      }
    }
    case "loaded": {
      switch (action.type) {
        case "CHANGE_INPUT": {
          return {
            ...prevState,
            searchInputValue: action.payload,
          };
        }
        case "FETCH": {
          return {
            ...prevState,
            tag: "loading",
          };
        }
      }
    }
    case "empty": {
      switch (action.type) {
        case "CHANGE_INPUT": {
          return {
            ...prevState,
            searchInputValue: action.payload,
          };
        }
        case "FETCH": {
          return {
            ...prevState,
            tag: "loading",
          };
        }
      }
    }
    case "error": {
      switch (action.type) {
        case "CHANGE_INPUT": {
          return {
            ...prevState,
            searchInputValue: action.payload,
          };
        }
        case "FETCH": {
          return {
            ...prevState,
            tag: "loading",
          };
        }
      }
    }
    default: {
      return prevState;
    }
  }
}

const App = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    dispatch({ type: "FETCH" });
  }, []);

  React.useEffect(() => {
    fetch(`https://dummyjson.com/products/search?q=${state.searchInputValue}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.total === 0) {
          dispatch({ type: "FETCH_EMPTY" });
        } else {
          dispatch({ type: "FETCH_SUCCESS", payload: res.products });
        }
      })
      .catch((err) => dispatch({ type: "FETCH_ERROR", payload: err?.message }));
  }, [state.tag]);

  return (
    <div>
      <input
        value={state.searchInputValue}
        onChange={(e) =>
          dispatch({ type: "CHANGE_INPUT", payload: e.target.value })
        }
        type="text"
        placeholder="type to search..."
      />
      <button onClick={() => dispatch({ type: "FETCH" })}>Search</button>
      {state.tag === "loading" && <p>Loading...</p>}
      {state.tag === "loaded" &&
        state.products.map((product, i) => {
          return <p key={i}>{product.title}</p>;
        })}
      {state.tag === "empty" && <p>Product Not Found, Sorry!</p>}
      {state.tag === "error" && <p>{state.errorMsg}</p>}
    </div>
  );
};

const rootNode = document.getElementById("root");
const root = ReactDOM.createRoot(rootNode);
root.render(React.createElement(App));
