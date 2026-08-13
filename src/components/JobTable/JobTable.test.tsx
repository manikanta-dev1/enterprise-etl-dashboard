import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Job } from '../../services/jobService';
import JobTable from './JobTable';

const job: Job = {
	id: 42,
	pipelineName: 'Customer Sync',
	status: 'success',
	startedAt: '2026-08-13T12:00:00Z',
	durationSeconds: 125,
	recordsProcessed: 2500,
};

describe('JobTable', () => {
	it('renders API job data in a table row', () => {
		render(<JobTable jobs={[job]} />);

		expect(screen.getByText('#42')).toBeInTheDocument();
		expect(screen.getByText('Customer Sync')).toBeInTheDocument();
		expect(screen.getByText('success')).toBeInTheDocument();
		expect(screen.getByText('2m 5s')).toBeInTheDocument();
		expect(screen.getByText(new Intl.NumberFormat().format(2500))).toBeInTheDocument();
	});

	it('shows an empty state when the API returns no jobs', () => {
		render(<JobTable jobs={[]} />);

		expect(screen.getByText('No jobs returned by the API.')).toBeInTheDocument();
	});
});
