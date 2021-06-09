import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import {transformJSON} from "./json-converter"
import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  InputGroup,
  Row,
} from "react-bootstrap";

function App() {
  const [inputObj, setInputObj] = React.useState<any>({});
  const [outputObj, setOutputObj] = React.useState<any>({});
  const [inputProperty, setInputProperty] = React.useState<string>("");
  const [propertyStrings, setPropertyStrings] = React.useState<
    [string, string][]
  >([]);

  const downloadTxtFile = (stringToSave:string) => {
    const element = document.createElement("a");
    const file = new Blob([stringToSave], {type: 'application/json'});
    element.href = URL.createObjectURL(file);
    element.download = "output.json";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  const setAndAddProperties = (propertyString: string) => {
    if (inputProperty) {
      setPropertyStrings((cur) => [...cur, [inputProperty, propertyString]]);
      setInputProperty("");
    }
  };

  const handleUpload = (
    files: FileList | null,
    setter: React.Dispatch<React.SetStateAction<any>>
  ) => {
    if (files) {
      let file = files.item(0);
      if (file) {
        const fileReader = new FileReader();
        fileReader.readAsText(file, "UTF-8");
        fileReader.onload = (e: any) => {
          console.log(JSON.parse(e.target.result));
          setter(JSON.parse(e.target.result));
          setPropertyStrings([])
          setInputProperty("")
        };
      }
    }
  };

  const createLists = (
    obj: any,
    parent: string,
    key: string,
    setter: React.Dispatch<React.SetStateAction<string>> | ((p: string) => void)
  ) => {
    let objType = Object.prototype.toString.call(obj);
    let propertyString = parent ? parent + "." + key : key;
    if (objType == "[object Object]") {
      return (
        <li>
          <Button onClick={() => setter(propertyString)}>
            {propertyString}
          </Button>
          <ul>
            {Object.keys(obj).map((key2) =>
              createLists(obj[key2], propertyString, key2, setter)
            )}
          </ul>
        </li>
      );
    }
    return (
      <li>
        <Button onClick={() => setter(propertyString)}>{propertyString}</Button>
      </li>
    );
  };
  return (
    <Container>
      <Row>
        <Col>
          <Row>
            <Form.File
              accept="application/JSON"
              onChange={({
                target: { files },
              }: React.ChangeEvent<HTMLInputElement>) =>
                handleUpload(files, setInputObj)
              }
            ></Form.File>
            <ul>
              {Object.keys(inputObj).map((key) =>
                createLists(inputObj[key], "", key, setInputProperty)
              )}
            </ul>
          </Row>
        </Col>
        <Col>
          <Row>
            <Form.File
              accept="application/JSON"
              onChange={({
                target: { files },
              }: React.ChangeEvent<HTMLInputElement>) =>
                handleUpload(files, setOutputObj)
              }
            ></Form.File>
            <ul>
              {Object.keys(outputObj).map((key) =>
                createLists(outputObj[key], "", key, setAndAddProperties)
              )}
            </ul>
          </Row>
        </Col>
      </Row>
      {propertyStrings.map(([ip, op], idx) => {
        return (
          <Row>
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <Button
                    onClick={() => {
                      setPropertyStrings((cur) => {
                        let newStrings = cur.slice();
                        newStrings.splice(idx, 1);
                        return newStrings;
                      });
                    }}
                    variant="outline-danger"
                  >
                    Remove
                  </Button>
                </InputGroup.Prepend>
                <FormControl disabled value={ip} />
              </InputGroup>
            </Col>
            <Col>{"--->"}</Col>
            <Col>
              <FormControl disabled value={op} />
            </Col>
          </Row>
        );
      })}
      <Row>
        <Col>
          <FormControl disabled value={inputProperty} />
        </Col>
        <Col>{"--->"}</Col>
        <Col>
          <FormControl disabled value={""} />
        </Col>
      </Row>
      <Button onClick={() => downloadTxtFile(JSON.stringify(propertyStrings))}>Save this configuration</Button>
      <Button onClick={() => downloadTxtFile(JSON.stringify(transformJSON(inputObj, outputObj, propertyStrings)))}>Download Output</Button>
    </Container>
  );
}

export default App;
