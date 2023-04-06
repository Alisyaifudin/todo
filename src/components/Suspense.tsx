interface Props {
  children: React.ReactNode;
  fallback: React.ReactNode;
  isFallback: boolean;
}

function Suspense({ children, fallback, isFallback }: Props) {
  if (isFallback) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export default Suspense;
