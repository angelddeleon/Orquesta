import { useState } from 'react'

const ExpansiveToast = ({ title, content }) => {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <div className="p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="flex-grow-1 me-3">
                    <h6 className="mb-0 fw-semibold text-nowrap">{title}</h6>
                </div>
                <button className="btn btn-secundary text-secondary" onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? <i className="fa-solid fa-caret-up"></i> : <i className="fa-solid fa-caret-down"></i>}
                </button>
            </div>

            {isExpanded && <div className="border-top mt-2 pt-2">{content}</div>}
        </div>
    )
}
export default ExpansiveToast
