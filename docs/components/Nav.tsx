import Link from 'next/link';
import { useRouter } from 'next/router';

interface ILinks {
  label: string;
  href: string;
}

interface IProps {
  links: ILinks[];
}

export default function Nav({ links }: IProps) {
  const router = useRouter();

  return (
    <div className="container">
      <img src="./img_logo.png" />

      <nav>
        <ul>
          {links.map((link) => (
            <li key={`nav-link-${link.href}`}>
              <Link href={link.href}>
                <a className={router.pathname === link.href ? 'active' : ''}>
                  {link.label}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <style jsx>{`
        .container {
          display: flex;
          height: 70px;
          width: 100%;
          position: relative;
          z-index: 10;
          justify-content: space-between;
        }

        .container::before {
          content: '';
          background: url('./bg_home.jpg');
          opacity: 0.5;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          position: absolute;
          z-index: -1;
        }

        img {
          height: 50px;
          margin: 10px 0 10px 30px;
        }

        nav {
          display: flex;
          text-transform: uppercase;
          margin-right: 50px;
        }

        nav ul {
          display: grid;
          grid-auto-flow: column;
          grid-column: auto;
          align-items: center;
          justify-items: center;
          list-style: none;
          gap: 16px;
        }

        nav ul a {
          color: white;
        }

        nav ul a:hover,
        nav ul a.active {
          color: #00d2ff;
        }
      `}</style>
    </div>
  );
}
