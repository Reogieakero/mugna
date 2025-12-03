// Header.tsx (A new component file)

import Link from 'next/link'; // Assuming Next.js framework

const Header = () => {
  return (
    <header className="mugna-header">
      <div className="logo">
        <Link href="/">
          {/* Replace with your actual MUGNA logo/text */}
          MUGNA
        </Link>
      </div>

      {/* Main Navigation Links */}
      <nav className="main-nav">
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/products">Products</Link></li>
          <li><Link href="/crafters">Crafters</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>
      </nav>

      {/* User Avatar and Dropdown */}
      <div className="user-profile">
        {/* <div className="avatar-container" onClick={toggleUserDropdown}>
          <span className="user-avatar">👤</span>
        </div> */}

        {/* <div className="user-dropdown-menu">
          <Link href="/profile">My Profile</Link>
          <hr />
          <button onClick={handleLogout}>Logout</button>
        </div> */}
      </div>
    </header>
  );
};

export default Header;