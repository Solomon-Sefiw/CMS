import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const getDetailPageUrl = ({
  id,
  versionNumber,
}: {
  id?: number;
  versionNumber?: string;
}) =>
  (id &&
    `/case-detail/${id}${
      (versionNumber && `?version=${versionNumber}`) || ""
    }`) ||
  undefined;

export const useNavigateToCaseDetailPage = () => {
  const navigate = useNavigate();
  const navigateToDetailPage = useCallback(
    (args: { id?: number; versionNumber?: string }) => () => {
      const url = getDetailPageUrl(args);
      url && navigate(url);
    },
    [navigate]
  );

  return { navigateToDetailPage };
};
