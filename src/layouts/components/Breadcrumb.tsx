
import { Link } from "react-router-dom";

interface BreadcrumbProps {
  current: string;
}

const Breadcrumb = ({ current }: BreadcrumbProps) => {
  return (
    <nav className="bg-gray-100 py-2 px-4 text-sm text-gray-700" aria-label="Breadcrumb">
      <div className="max-w-7xl mx-auto">
        <ol className="list-none flex items-center space-x-2">
          <li>
            <Link to="/" className="text-gray-600 hover:underline">Trang chủ</Link>
          </li>
          <li>{'>'}</li>
          <li className="text-green-700 font-semibold">{current}</li>
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;
