import React from 'react'

const Filter = ( { value, handleSearchChange, filteredPersons } ) => {
    return (
        <div>
            filter shown with <input value={value} onChange={handleSearchChange} />
            <ul>
                {filteredPersons.map(person => <div key={person.name}>{person.name}</div>)}
            </ul>
        </div>
    )
}


export default Filter