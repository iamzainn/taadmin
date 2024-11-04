import { Button } from "@/components/ui/button";
import { useSearchParams } from 'next/navigation';

type PaginationProps = {
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ totalPages, onPageChange }: PaginationProps) {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  return (
    <div className="flex justify-between items-center mt-4">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <span>Page {currentPage} of {totalPages}</span>
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
}