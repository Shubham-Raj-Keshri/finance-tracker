import { useEffect } from "react";
import API from "../services/api";

function Test() {
  useEffect(() => {
    API.get("/transactions")
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
  }, []);

  return <h2>Check console</h2>;
}

export default Test;