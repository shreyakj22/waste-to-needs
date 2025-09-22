import React, { useState } from 'react';

const styles = {
  formContainer: {
    maxWidth: '400px',
    margin: '40px auto',
    padding: '30px',
    borderRadius: '8px',
    backgroundColor: '#f0f4f8',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  heading: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#34495e',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    marginBottom: '15px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    minHeight: '80px',
    padding: '8px 12px',
    marginBottom: '15px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#219150',
  },
};

function DonationForm() {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [isHover, setIsHover] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just log the data
    console.log({ itemName, description, image });
    alert('Donation submitted!');
    // Clear form
    setItemName('');
    setDescription('');
    setImage(null);
  };

  return (
    <form style={styles.formContainer} onSubmit={handleSubmit}>
      <h2 style={styles.heading}>Donate an Item</h2>

      <label style={styles.label} htmlFor="itemName">Item Name:</label>
      <input
        id="itemName"
        type="text"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        style={styles.input}
        placeholder="Enter the item name"
        required
      />

      <label style={styles.label} htmlFor="description">Description:</label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={styles.textarea}
        placeholder="Write a brief description"
        required
      />

      <label style={styles.label} htmlFor="imageUpload">Upload Image:</label>
      <input
        id="imageUpload"
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        style={{ marginBottom: '20px' }}
        required
      />

      <button
        type="submit"
        style={isHover ? {...styles.button, ...styles.buttonHover} : styles.button}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        Submit Donation
      </button>
    </form>
  );
}

export default DonationForm;

