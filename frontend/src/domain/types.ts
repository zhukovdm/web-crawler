export type RecordFilters = {

  /**
   * Exact matching.
   */
  url?: string;

  /**
   * Label as a substring.
   */
  label?: string;

  /**
   * Has a tag from the list.
   */
  tags: string[];
};



export type RecordSorters = {

  /**
   * Sort by url in lexicographic order.
   */
  url: boolean;

  /**
   * Sort by date from the earliest 
   */
  lastCrawlTime: boolean;
};
