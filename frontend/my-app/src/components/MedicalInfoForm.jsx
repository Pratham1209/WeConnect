import React, { useState } from 'react';

function MedicalInfoForm() {
  const [info, setInfo] = useState({ bloodType: '', allergies: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Medical Info:', info);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Blood Type"
        value={info.bloodType}
        onChange={(e) => setInfo({ ...info, bloodType: e.target.value })}
      />
      <input
        placeholder="Allergies"
        value={info.allergies}
        onChange={(e) => setInfo({ ...info, allergies: e.target.value })}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default MedicalInfoForm;
