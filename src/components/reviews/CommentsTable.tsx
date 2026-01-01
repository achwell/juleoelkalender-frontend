import { FC } from "react";

const CommentsTable: FC<{ comments: (string | undefined)[] }> = ({ comments }) => {
    if (comments.length === 0) {
        return null;
    }

    const buildRows = () => {
        return comments
            .filter((c) => !!c)
            .map((c, index) => (
                <tr key={index}>
                    <td>{c}</td>
                </tr>
            ));
    };
    return (
        <table className="table table-striped">
            <tbody>{buildRows()}</tbody>
        </table>
    );
};
export default CommentsTable;
