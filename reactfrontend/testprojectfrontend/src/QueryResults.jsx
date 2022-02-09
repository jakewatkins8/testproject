import { useEffect } from "react";

const QueryResults = (props) => {

    const [results, setResults] = useState({});

    // run the re-mapping function every time the queryResults update:
    useEffect(() => {

        setResults(props.queryResults);

    }, [props.queryResults]);


    return (<>
    <div>
        <table>
            <thead>
                <tr>
                    <th>Date Created</th>
                    <th>Last Date Modified</th>
                    <th>Content</th>
                    <th>Author</th>
                    <th>ID</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    {results.map((dataRow) => {
                        return (<>
                                <td>{dataRow['dateCreated']}</td>
                                <td>{dataRow['userName']}</td>
                                <td>{dataRow['content']}</td>
                                <td>{dataRow['dateModified']}</td>
                                </>);
                    })}

                </tr>
            </tbody>
        </table>
    </div>
    </>);
};