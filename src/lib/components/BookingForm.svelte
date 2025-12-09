<script lang="ts">
	import type { FormData } from '$lib/types/FormInfo';

	interface Props {
		formData: FormData;
		formattedDate: string;
		selectedTime: string | null;
		isSubmitting: boolean;
		onBack: () => void;
		onSubmit: (e: Event) => void;
		onUpdateForm: (data: FormData) => void;
	}

	let { formData, formattedDate, selectedTime, isSubmitting, onBack, onSubmit, onUpdateForm }: Props = $props();

	function updateField(field: keyof FormData, value: string) {
		onUpdateForm({ ...formData, [field]: value });
	}
</script>

<div class="booking-section slide-in">
	<button class="back-link" onclick={onBack}>
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<path d="M19 12H5M12 19l-7-7 7-7" />
		</svg>
		Back
	</button>

	<h1 class="section-title">Enter your details</h1>
	<p class="section-subtitle">{formattedDate} at {selectedTime}</p>

	<form onsubmit={onSubmit} class="form">
		<div class="form-group">
			<label class="label" for="name">Full Name *</label>
			<input
				type="text"
				id="name"
				required
				class="input"
				value={formData.name}
				oninput={(e) => updateField('name', e.currentTarget.value)}
				placeholder="John Smith"
			/>
		</div>

		<div class="form-group">
			<label class="label" for="email">Email Address *</label>
			<input
				type="email"
				id="email"
				required
				class="input"
				value={formData.email}
				oninput={(e) => updateField('email', e.currentTarget.value)}
				placeholder="john@company.com"
			/>
		</div>

		<div class="form-group">
			<label class="label" for="company">Company</label>
			<input
				type="text"
				id="company"
				class="input"
				value={formData.company}
				oninput={(e) => updateField('company', e.currentTarget.value)}
				placeholder="Your company name"
			/>
		</div>

		<div class="form-group">
			<label class="label" for="notes">Additional Notes</label>
			<textarea
				id="notes"
				class="textarea"
				value={formData.notes}
				oninput={(e) => updateField('notes', e.currentTarget.value)}
				placeholder="Anything you'd like us to know before the call?"
				rows="3"
			></textarea>
		</div>

		<button type="submit" class="continue-btn" disabled={isSubmitting}>
			{#if isSubmitting}
				<span class="spinner"></span>
				Scheduling...
			{:else}
				Schedule Meeting
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M5 12h14M12 5l7 7-7 7" />
				</svg>
			{/if}
		</button>
	</form>
</div>

<style>
	@keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
	@keyframes spin { to { transform: rotate(360deg); } }
	.booking-section { max-width: 600px; }
	.slide-in { animation: slideIn 0.4s ease-out; }
	.section-title { font-family: 'Fraunces', serif; font-size: 28px; font-weight: 600; color: #1a1a2e; margin: 0 0 8px 0; }
	.section-subtitle { font-size: 15px; color: #64748b; margin: 0 0 32px 0; }
	.back-link { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; color: #64748b; background: none; border: none; cursor: pointer; margin-bottom: 24px; padding: 0; transition: color 0.2s ease; }
	.back-link:hover { color: #667eea; }
	.form { display: flex; flex-direction: column; gap: 20px; }
	.form-group { display: flex; flex-direction: column; gap: 8px; }
	.label { font-size: 14px; font-weight: 600; color: #374151; }
	.input, .textarea { padding: 14px 16px; font-size: 15px; border: 2px solid #e2e8f0; border-radius: 10px; transition: all 0.2s ease; font-family: inherit; }
	.input:focus, .textarea:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); }
	.textarea { resize: vertical; min-height: 80px; }
	.continue-btn { margin-top: 12px; width: 100%; padding: 16px 24px; font-size: 16px; font-weight: 600; color: white; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); }
	.continue-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4); }
	.continue-btn:disabled { opacity: 0.5; cursor: not-allowed; }
	.spinner { width: 18px; height: 18px; border: 2px solid rgba(255, 255, 255, 0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
</style>
