import React from "react";
export default function SignIn() {
 
  return (
    <div >
      <div style={{ background: 'rgba(255, 255, 255, 0.8)', padding: '20px', borderRadius: '10px' }}>
        <h1>Sign In</h1>
        <form>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
}
